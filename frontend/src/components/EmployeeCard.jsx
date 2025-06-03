import React from 'react';

function EmployeeCard({ employee }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold">{employee.name}</h3>
      <p><strong>Skills:</strong> {employee.skills.join(', ')}</p>
      <p><strong>Experience:</strong> {employee.experience_years} years</p>
      <p><strong>Projects:</strong> {employee.projects.join(', ')}</p>
      <p><strong>Availability:</strong> {employee.availability}</p>
    </div>
  );
}

export default EmployeeCard;