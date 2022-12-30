const fs = require('fs');
const inquirer = require('inquirer');
const manager = require('./lib/manager.js')
const Intern = require('./lib/intern.js')
const Engineer = require('./lib/engineer.js')
const generate = require('./src/generateHTML.js')

let myhtml;

inquirer
  .prompt([
    {
      type: 'input',
      message: '> Enter the TEAM NAME.',
      name: 'teamname',
    },
    {
      type: 'input',
      message: '> Enter the name of the team MANAGER.',
      name: 'name',
    },
    {
      type: 'input',
      message: '> Enter the ID number of the team MANAGER.',
      name: 'id',
      validate: isNumber,
    },
    {
      type: 'input',
      message: '> Enter the email of the team MANAGER.',
      name: 'email',
      validate: isEmail,
    },
    {
      type: 'input',
      message: '> Enter the office number of the team MANAGER.',
      name: 'office',
      validate: isNumber,
    },
    {
      type: 'list',
      message: '> Enter the next team member:',
      name: 'next', 
      choices:['Engineer', 'Intern', 'End'],
    },
  ])
  .then((response) => {
    //response.confirm === response.password ? console.log('Success!') : console.log('You forgot your password already?!')'
    myhtml = response.teamname + ".html";
    fs.writeFile(myhtml, generate.generateHTML(response), (err) => err ? console.error(err) : console.log(''));

    cycler(response.next)
  });





function cycler(next) {




   console.log('> Check complete!');
   if (next === 'End') {fs.appendFile(myhtml, "</main></body></html>", (error) => error ? console.error(error) : console.log('> Finished!'));
}
   else {nextprompt(next);}
}

async function isNumber(x) {
   if (isNaN(Number(x))) {return 'Must input a number!';}
   return true;
}

async function isEmail(x) {
   if (!x.includes('@')) {return 'Must input an email!';}
   return true;
}

function nextprompt(x) {

  if (x === 'Engineer') {
  inquirer
  .prompt([
    {
      type: 'input',
      message: '> Enter the name of the ENGINEER.',
      name: 'name',
    },
    {
      type: 'input',
      message: '> Enter the ID number of the ENGINEER.',
      name: 'id',
      validate: isNumber,
    },
    {
      type: 'input',
      message: '> Enter the email of the ENGINEER.',
      name: 'email',
      validate: isEmail,
    },
    {
      type: 'input',
      message: '> Enter the github username of the ENGINEER.',
      name: 'github',
    },
    {
      type: 'list',
      message: '> Enter the next team member:',
      name: 'next', 
      choices:['Engineer', 'Intern', 'End'],
    },
  ])
  .then((response) => {
    let engineer = new Engineer(response.name, response.id, response.email, response.github);
    fs.appendFile(myhtml, generate.generateHTML(response), (error) => error ? console.error(error) : error++);
    cycler(response.next);
  });
  }
if (x === 'Intern') {
  inquirer
  .prompt([
    {
      type: 'input',
      message: '> Enter the name of the INTERN.',
      name: 'name',
    },
    {
      type: 'input',
      message: '> Enter the ID number of the INTERN.',
      name: 'id',
      validate: isNumber,
    },
    {
      type: 'input',
      message: '> Enter the email of the INTERN.',
      name: 'email',
      validate: isEmail,
    },
    {
      type: 'input',
      message: '> Enter the school of the INTERN.',
      name: 'school',
    },
    {
      type: 'list',
      message: '> Enter the next team member:',
      name: 'next', 
      choices:['Engineer', 'Intern', 'End'],
    },
  ])
  .then((response) => {
    let intern = new Intern(response.name, response.id, response.email, response.school);
    fs.appendFile(myhtml, generate.generateHTML(response), (error) => error ? console.error(error) : error++);
    cycler(response.next);
  });
    }
  
}

