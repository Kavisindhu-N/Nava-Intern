
//  ---------------------------------------------------------------Storing elements in the array ---------------------------------------------
// var questionBox = [document.getElementById("inputgroup1") , 
//                    document.getElementById("inputgroup2") , 
//                    document.getElementById("inputgroup3") , 
//                    document.getElementById("inputgroup4") , 
//                    document.getElementById("inputgroup5") , 
//                    document.getElementById("inputgroup6") ,
//                    document.getElementById("inputgroup7") ,
//                    document.getElementById("inputgroup8") ,
//                    document.getElementById("inputgroup9") ,
//                    document.getElementById("inputgroup10") , 
//                   ];

var questionBox = [];
for (i = 1; i <= 10; i++) {
    questionBox.push(document.getElementById(`inputgroup${i}`));  //("inputgroup" + i)
}
console.log(questionBox);
//----------------------------------------------------------------------------------------------------------------------------------------------


var correctAnswer = ["Bit", "8 bits", "1010", "1024 bytes", "pb", "4 bits", "11001", "1024 kb", "bit", "1073741824 bytes"];







// ------------------------------------------------------------Hiding all question except first 1-----------------------------------------------
// for(var i =1 ; i <= questionBox.length ; i++){
//     questionBox[i] . style . display = "none";
// }
questionBox.map((question, index) => {
    if (index !== 0) {
        question.style.visibility = "hidden";
    }
});
// ---------------------------------------------------------------------------------------------------------------------------------------------







// -----------------------------------------------onclick event [submit] Generates next one and hides the previous -----------------------------
var currentIndex = 0;
function nextQuestion(event) {
    event.preventDefault();

    if (currentIndex < questionBox.length - 1) {                     // currentIndex  (0) < questionBox.length(10)- 1=  9 [0 < 9] q1
                                                                     // currentIndex (1) < questionBox.length(10) - 1 = 9 [1 < 9] q2
        questionBox[currentIndex].style.visibility = "hidden"; //8   // currentIndex (2) < questionBox.length(10) - 1=  9 [2 < 9] q3
        currentIndex++;//9                                           // currentIndex (3) < questionBox.length(10) - 1 = 9 [3 < 9] q4 .......
        questionBox[currentIndex].style.visibility = "visible";      // currentIndex (7) < questionBox.length(10) - 1 = 9 [7 < 9] q8
    }                                                                // currentIndex (8) < questionBox.length(10) - 1 = 9 [8 < 9] q9
    else {                                                           // currentIndex (9) < questionBox.length(10) - 1 = 9 [9 < 9] fasls(else)

        // -------------------------------------------Getting Selected Values & validating -----------------------------------------------------
        var userAnswers = [];
        var score = 0;


        questionBox.map((question, index) => { //for(index=0;index < questionBox.length ; index++)
            var selectedOption = document.querySelector(`input[name="question${index + 1}"]:checked`);   //"question" + (index + 1)
            if (selectedOption)
                userAnswers.push(selectedOption.value);
            else {
                userAnswers.push(null);
            }
        });

        console.log(userAnswers);
        localStorage.setItem("correctAnswer",JSON.stringify(userAnswers));
        correctAnswer.map((value, i) => {
            if (correctAnswer[i] === userAnswers[i]) {
                console.log(`your answer is correct :${userAnswers[i]}`);
                score++;
            }
            else if (userAnswers[i] === null) {
                console.log(`You did not respond to it , The answer is : ${correctAnswer[i]}`)
            }
            else {
                console.log(`Your answer is wrong :${userAnswers[i]} , The correct answer is : ${correctAnswer[i]}`)
            }
        });


        console.log(`Your Score is : ${score}`);    // console.log("Your Score is : " +score);

        for (i = 1; i <= 10; i++) {
            localStorage.setItem(`q${i}Text`, document.getElementById(`q${i}`).textContent);
            // window.location.href = "result.html";
        }

        window.location.href = "result.html";

    }

    

}

// const data = [name1]
