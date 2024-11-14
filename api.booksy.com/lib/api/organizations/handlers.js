const db = require('../../db/index.json');

module.exports = (server, gusto) => {
  return {
    async createEmbeddedPayroll(request, h) {
      await gusto.createCompany(db);

      for (let i = 0; i <= db.employees.length - 1; i++) {
        const employee = db.employees[i];
        await gusto.createEmployee({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          date_of_birth: employee.date_of_birth,
          ssn: employee.ssn
        });
      }
      return gusto.createCompanyOnboardingFlow();
    }
  };
};
