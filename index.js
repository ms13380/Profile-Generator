const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const html = require("./src/htmlTemp");
const validator = require("email-validator");
const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);
let teamArray = [];
let teamString = ``;
console.clear();
console.log("---------------------------------------------");
console.log("Team Portfolio Generator by nosremetnarg")
async function main() {
    try {
        await prompt()
        for (let i = 0; i < teamArray.length; i++) {
            teamString = teamString + html.generateCard(teamArray[i]);
        }
        let finalHtml = html.generateHTML(teamString)
        console.clear();
        console.log("---------------------------------------------");
        console.log("Generating index.html file....");
        console.log("---------------------------------------------");
        writeFileAsync("./dist/index.html", finalHtml);
        console.clear();
        console.log("---------------------------------------------");
        console.log("index.html file created successfully");
        console.log("---------------------------------------------");
    } catch (err) {
        return console.log(err);
    }
}
async function prompt() {
    let responseDone = "";

    do {
        try {
            console.log("---------------------------------------------");
            let response = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What is employee's name?",
                    validate: function validateName(name) {
                        return name !== "";
                    }
                },
                {
                    type: "input",
                    name: "id",
                    message: "Enter employee's ID: ",
                    validate: function validateName(name) {
                        return name !== "";
                    }
                },
                {
                    type: "input",
                    name: "email",
                    message: "Enter employee's email address: ",
                    // validation using email-validator
                    validate: function validateName(name) {
                        return validator.validate(name);
                    }
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is the employee's role: ",
                    choices: [
                        "Engineer",
                        "Intern",
                        "Manager"
                    ]
                }
            ]);
            let response2 = ""
            if (response.role === "Engineer") {
                response2 = await inquirer.prompt([{
                    type: "input",
                    name: "x",
                    message: "What is the employee's github username?: ",
                    validate: function validateName(name){
                        return name !== "";
                    },
                }, ]);
                const engineer = new Engineer(response.name, response.id, response.email, response2.x);
                teamArray.push(engineer);
            
            } else if (response.role === "Manager") {
                response2 = await inquirer.prompt([{
                    type: "input",
                    name: "x",
                    message: "What is the employee's office number?: ",
                    validate: function validateName(name){
                        return name !== "";
                    },
                }, ]);
                const manager = new Manager(response.name, response.id, response.email, response2.x);
                teamArray.push(manager);

            } else if (response.role === "Intern") {
                response2 = await inquirer.prompt([{
                    type: "input",
                    name: "x",
                    message: "What school is employee attending: ",
                    validate: function validateName(name){
                        return name !== "";
                    },
                }, ]);
                const intern = new Intern(response.name, response.id, response.email, response2.x);
                teamArray.push(intern);
            }
        } catch (err) {
            return console.log(err);
        }
        responseDone = await inquirer.prompt([{
            type: "list",
            name: "finish",
            message: "Do you want to continue?: ",
            choices: [
                "Yes",
                "No"
            ]
        },]);
    } while (responseDone.finish === "Yes");
}
