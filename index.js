import {searchProfessorsAtSchoolId, searchSchool, getProfessorRatingAtSchoolId} from "rmp-api";
import { json2csv } from 'json-2-csv';


const dataArr = [];

async function getProfessors(){

    for (let i = 0; i < 2; i++) {
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
        for (let i = 0; i < 2; i++) {
            let profRatings = await getProfessorRatingAtSchoolId(`${dataArr[i]['tFname']}` + "" + `${dataArr[i]['tLname']}`, schoolId);
            
            
            //console.log(profRatings);
            let newData = {"Reviews": profRatings};
            console.log(newData);
            //dataArr[i].push(newData);
        }
        //console.log(schoolId);
    }
} 

function printArr() {
    for (let i = 0; i < 2; i++) {
        let obj = dataArr[i];
        console.log(obj);
    }
}

await getProfessors();
printArr();
await searchSJSU();

//let profRatings = await getProfessorRatingAtSchoolId(`${dataArr[0]['tFname']}` + " " + `${dataArr[0]['tLname']}`, "U2Nob29sLTg4MQ==");
//console.log(`${dataArr[0]['tFname']}` + "" + `${dataArr[0]['tLname']}`)