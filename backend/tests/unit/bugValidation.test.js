const { validateBug } = require('../../data/store');

describe('Bug Validation', () => {
  it('should validate a bug with required fields', () => {
    const validBug = {
      title: 'Test Bug',
      description: 'This is a test bug description',
      reporter: 'John Doe'
    };

    const errors = validateBug(validBug);
    expect(errors).toHaveLength(0);
  });

  it('should reject a bug without title', () => {
    const invalidBug = {
      description: 'This is a test bug description',
      reporter: 'John Doe'
    };

    const errors = validateBug(invalidBug);
    expect(errors).toContain('Title is required');
  });

  it('should reject a title longer than 100 characters', () => {
    const invalidBug = {
      title: 'a'.repeat(101),
      description: 'This is a test bug description',
      reporter: 'John Doe'
    };

    const errors = validateBug(invalidBug);
    expect(errors).toContain('Title cannot exceed 100 characters');
  });

  it('should reject a description longer than 500 characters', () => {
    const invalidBug = {
      title: 'Valid Title',
      description: 'a'.repeat(501),
      reporter: 'John Doe'
    };

    const errors = validateBug(invalidBug);
    expect(errors).toContain('Description cannot exceed 500 characters');
  });

  it('should reject invalid priority', () => {
    const invalidBug = {
      title: 'Valid Title',
      description: 'Valid description',
      reporter: 'John Doe',
      priority: 'invalid-priority'
    };

    const errors = validateBug(invalidBug);
    expect(errors).toContain('Priority must be low, medium, or high');
  });
});