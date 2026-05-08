import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, Form } from 'react-bootstrap';
import { AssessmentService } from '../../services/AssessmentService';

const INSTRUMENT_TYPE = `Cat Behavioral Instrument`;

const QUESTIONS = [
  {
    id: `q1`,
    options: [{ label: `No`, score: 0 }, { label: `Yes`, score: 1 }],
    text: `Previous contact with the Cat Judicial System`,
  },
  {
    id: `q2`,
    options: [{ label: `0-3 altercations`, score: 0 }, { label: `3+ altercations`, score: 1 }],
    text: `Physical altercations with other cats`,
  },
  {
    id: `q3`,
    options: [{ label: `0-10 altercations`, score: 0 }, { label: `10+ altercations`, score: 1 }],
    text: `Physical altercations with owner (scratching, biting, etc...)`,
  },
  {
    id: `q4`,
    options: [{ label: `Yes`, score: 0 }, { label: `No`, score: 1 }],
    text: `Plays well with dogs`,
  },
  {
    id: `q5`,
    options: [{ label: `No`, score: 0 }, { label: `Yes`, score: 1 }],
    text: `Hisses at strangers`,
  },
];

const getRiskLevel = (score) => {
  if (score <= 1) {
    return `low`;
  }
  if (score <= 3) {
    return `medium`;
  }
  return `high`;
};

export const NewAssessment = () => {
  const [ submitStatus, setSubmitStatus ] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    try {
      const score = QUESTIONS.reduce((sum, q) => sum + Number(data[q.id]), 0);
      await AssessmentService.submit({
        catDateOfBirth: data.catDateOfBirth,
        catName: data.catName,
        instrumentType: INSTRUMENT_TYPE,
        riskLevel: getRiskLevel(score),
        score,
      });
      setSubmitStatus({ message: `Assessment submitted successfully!`, type: `success` });
      reset();
    } catch (err) {
      setSubmitStatus({ message: `Submission failed: ${err.message}`, type: `danger` });
    }
  };

  return <Form onSubmit={handleSubmit(onSubmit)} noValidate>
    <h4 className="mb-4">New Assessment</h4>

    {submitStatus &&
      <Alert
        dismissible
        variant={submitStatus.type}
        onClose={() => setSubmitStatus(null)}
      >
        {submitStatus.message}
      </Alert>}

    <Form.Group className="mb-3" controlId="instrumentType">
      <Form.Label>Instrument</Form.Label>
      <Form.Control readOnly type="text" value={INSTRUMENT_TYPE} />
    </Form.Group>

    <Form.Group className="mb-3" controlId="catName">
      <Form.Label>Cat Name</Form.Label>
      <Form.Control
        isInvalid={!!errors.catName}
        placeholder="e.g. Mr. Fluffykins"
        type="text"
        {...register(`catName`, { required: `Cat name is required` })}
      />
      <Form.Control.Feedback type="invalid">
        {errors.catName?.message}
      </Form.Control.Feedback>
    </Form.Group>

    <Form.Group className="mb-3" controlId="catDateOfBirth">
      <Form.Label>Cat Date of Birth</Form.Label>
      <Form.Control
        isInvalid={!!errors.catDateOfBirth}
        type="date"
        {...register(`catDateOfBirth`, { required: `Date of birth is required` })}
      />
      <Form.Control.Feedback type="invalid">
        {errors.catDateOfBirth?.message}
      </Form.Control.Feedback>
    </Form.Group>

    <hr className="my-4" />
    <h5 className="mb-3">Assessment Questions</h5>

    {QUESTIONS.map((question, index) =>
      <Form.Group key={question.id} className="mb-4">
        <Form.Label className="fw-semibold">
          {index + 1}. {question.text}
        </Form.Label>
        {question.options.map((option) =>
          <Form.Check
            key={option.score}
            id={`${question.id}-${option.score}`}
            isInvalid={!!errors[question.id]}
            label={option.label}
            type="radio"
            value={option.score}
            {...register(question.id, { required: `Please select a response` })}
          />)}
        {errors[question.id] &&
          <Form.Text className="text-danger">
            {errors[question.id].message}
          </Form.Text>}
      </Form.Group>)}

    <Button disabled={isSubmitting} type="submit" variant="primary">
      {isSubmitting ? `Submitting...` : `Submit Assessment`}
    </Button>
  </Form>;
};
