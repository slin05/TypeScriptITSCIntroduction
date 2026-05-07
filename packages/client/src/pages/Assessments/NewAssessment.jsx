import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AssessmentService } from '../../services/AssessmentService';

export const NewAssessment = () => {
  const [ formData, setFormData ] = useState({
    catDateOfBirth: ``,
    catName: ``,
    instrumentType: ``,
    riskLevel: ``,
    score: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === `score` ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AssessmentService.submit(formData);
      alert(`Assessment created successfully!`);
      // Reset form or redirect
    } catch (error) {
      alert(`Error creating assessment: ${error.message}`);
    }
  };

  return <Form onSubmit={handleSubmit}>
    <Form.Group controlId="catName">
      <Form.Label>Cat Name</Form.Label>
      <Form.Control
        type="text"
        name="catName"
        value={formData.catName}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group controlId="catDateOfBirth">
      <Form.Label>Cat Date of Birth</Form.Label>
      <Form.Control
        type="date"
        name="catDateOfBirth"
        value={formData.catDateOfBirth}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group controlId="instrumentType">
      <Form.Label>Instrument Type</Form.Label>
      <Form.Control
        type="text"
        name="instrumentType"
        value={formData.instrumentType}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Form.Group controlId="score">
      <Form.Label>Score</Form.Label>
      <Form.Control
        type="number"
        name="score"
        value={formData.score}
        onChange={handleChange}
        min="0"
        max="5"
        required
      />
    </Form.Group>

    <Form.Group controlId="riskLevel">
      <Form.Label>Risk Level</Form.Label>
      <Form.Control
        type="text"
        name="riskLevel"
        value={formData.riskLevel}
        onChange={handleChange}
        required
      />
    </Form.Group>

    <Button variant="primary" type="submit">Submit</Button>
  </Form>;
};
