import {searchProfessorsAtSchoolId, searchSchool, getProfessorRatingAtSchoolId} from "rmp-api";
import * as fs from 'node:fs';
import { json2csv } from 'json-2-csv';


const dataArr = [];
const regex = /[^a-zA-Z0-9]/g;

async function getProfessors(){

    for (let i = 0; i < 242; i++) {
        let result = await fetch(`https://www.ratemyprofessors.com/filter/professor/?&page=${i}&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=881`);

        let response = await result.json();
        dataArr.push(...response['professors']);
    }

    const fieldnames = Object.keys(dataArr[0]);

}

async function searchSJSU() {
    const SJSU = await searchSchool("San Jose State University");
    if (SJSU !== undefined) {
        const schoolId = SJSU[0].node.id;
        console.log(schoolId);
        for (let i = 0; i < 4820; i++) {
            console.log(`${dataArr[i]['tFname']}` + "" + `${dataArr[i]['tLname']}`);
            let profRatings = await searchProfessorsAtSchoolId(`${dataArr[i]['tFname']}`.replaceAll(regex, "").trim() + " " + `${dataArr[i]['tLname']}`.replaceAll(regex, "").trim()  , schoolId);
            
            console.log(profRatings);

            let correctProf = profRatings.filter((x) => x.node.firstName.replaceAll(regex, "").trim() === dataArr[i]['tFname'].replaceAll(regex, "").trim() && x.node.lastName.replaceAll(regex, "").trim() === dataArr[i]['tLname'].replaceAll(regex, "").trim() && x.node.numRatings > 0);
            console.log(correctProf);
            if (correctProf.length > 0) {
                if (correctProf[0].node.courseCodes.length > 0) {
                    dataArr[i]['courseCodes'] = correctProf[0].node.courseCodes;
                } else if (correctProf[0].node.courseCodes.length === 0) {
                    dataArr[i]['courseCodes'] = ['N/A'];
            }
            }
            

    }
}
} 

const writeArrayToFile = () => {
    try {
        const jsonString = JSON.stringify(dataArr, null, 2);
        fs.writeFileSync('professors.json', jsonString, 'utf8');
        console.log('Data written to file');
    } catch (err) {
        console.error('Error writing file:', err);
    }
};


async function searchTest() {
    const SJSU = await searchSchool("San Jose State University");
    if (SJSU !== undefined) {
        const schoolId = SJSU[0].node.id;
        console.log(schoolId);
        console.log(`${dataArr[4]['tFname']}` + " " + `${dataArr[4]['tLname']}`);
        let profRatings = await searchProfessorsAtSchoolId(`${dataArr[4]['tFname']}` + " " + `${dataArr[4]['tLname']}`  , schoolId);
        //console.log(profRatings);
        //console.log(profRatings.filter((x) => x.node.firstName === dataArr[4]['tFname'] && x.node.lastName === dataArr[4]['tLname']));
        let correctProf = profRatings.filter((x) => x.node.firstName === dataArr[4]['tFname'] && x.node.lastName === dataArr[4]['tLname']);
        console.log(correctProf[0].node.courseCodes);

        if (correctProf[0].node.courseCodes.length > 0) {
            dataArr[4]['courseCodes'] = correctProf[0].node.courseCodes;
        }
}

}
function printArr() {
    for (let i = 0; i < 2; i++) {
        let obj = dataArr[i];
        console.log(obj);
    }
}

await getProfessors();
//printArr();
//console.log(dataArr[0]);
//await searchTest();
await searchSJSU();
//console.log(dataArr.length)
writeArrayToFile();
//console.log(dataArr[4]);
//let profRatings = await getProfessorRatingAtSchoolId(`${dataArr[0]['tFname']}` + " " + `${dataArr[0]['tLname']}`, "U2Nob29sLTg4MQ==");
//console.log(`${dataArr[0]['tFname']}` + "" + `${dataArr[0]['tLname']}`)   