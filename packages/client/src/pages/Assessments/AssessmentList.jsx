import { useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { AssessmentService } from '../../services/AssessmentService';

export const AssessmentList = () => {
  const [ assessments, setAssessments ] = useState([]);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await AssessmentService.getList();
        setAssessments(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAssessments();
  }, []);

  return <div className="p-4">
    <h4 className="mb-4">Assessment List</h4>

    {error && <Alert variant="danger">{error}</Alert>}

    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Cat Name</th>
          <th>Date of Birth</th>
          <th>Instrument</th>
          <th>Score</th>
          <th>Risk Level</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {assessments.map((assessment) =>
          <tr key={assessment.id}>
            <td>{assessment.catName}</td>
            <td>{assessment.catDateOfBirth}</td>
            <td>{assessment.instrumentType}</td>
            <td>{assessment.score}</td>
            <td>{assessment.riskLevel}</td>
            <td>{new Date(assessment.createdAt).toLocaleString()}</td>
          </tr>)}
        {assessments.length === 0 && !error &&
          <tr>
            <td colSpan={6} className="text-center text-muted">No assessments found.</td>
          </tr>}
      </tbody>
    </Table>
  </div>;
};
