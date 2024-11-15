const heads = {
  accept: "application/json",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json; charset=utf-8",
  priority: "u=1, i",
  "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};

// ASCII art logo with purple S
console.log(`%c   ██████╗%c █████╗ ██████╗  █████╗  ███████╗██████╗
  %c██╔════╝%c██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
  %c╚█████╗ %c██████╔╝███████║██║  ╚═╝█████╗  ██║  ██║
  %c ╚═══██╗%c██╔═══╝ ██╔══██║██║  ██╗██╔══╝  ██║  ██║
  %c██████╔╝%c██║     ██║  ██║╚█████╔╝███████╗██████╔╝
  %c╚═════╝ %c╚═╝     ╚═╝  ╚═╝ ╚════╝ ╚══════╝╚═════╝`,
 'color: #8A2BE2; font-weight: bold;',
 'color: white; font-weight: bold;',
 'color: #8A2BE2; font-weight: bold;',
 'color: white; font-weight: bold;',
 'color: #8A2BE2; font-weight: bold;',
 'color: white; font-weight: bold;',
 'color: #8A2BE2; font-weight: bold;',
 'color: white; font-weight: bold;',
 'color: #8A2BE2; font-weight: bold;',
 'color: white; font-weight: bold;',
 'color: #8A2BE2; font-weight: bold;',
 'color: white; font-weight: bold;',
);
console.log('%c❕Made By SpacedOutCode', 'color: #FFFFFF; font-weight: bold;');
console.log('\n%c⚡ Starting RuneBot...', 'color: #8A2BE2; font-weight: bold; font-size: 14px;');

const assignment_id = parseInt(window.location.href.split("assignment_id=")[1]);

// Initialize empty array for all questions
let questions = [];

// Collect all questions
document.querySelectorAll(".runestone_caption_divid").forEach((div) => {
    const divText = div.parentNode.innerText.toLowerCase();
    const questionId = div.innerText.replace(/[()]/g, "");
    
    if (divText.includes("multiple choice")) {
        questions.push({
            id: questionId,
            type: "multiple choice",
            scoreMax: parseInt(document.querySelector(`#${questionId}_score > span.qmaxscore`).innerText)
        });
    } else if (divText.includes("activecode")) {
        questions.push({
            id: questionId,
            type: "activecode",
            scoreMax: parseInt(document.querySelector(`#${questionId}_score > span.qmaxscore`).innerText)
        });
    }
});

// Helper function to create body for requests
const createRequestBody = (question, answerIndex = 0) => {
    if (question.type === "multiple choice") {
        return JSON.stringify({
            "event": "mChoice",
            "act": `answer:${answerIndex}:correct`,
            "answer": answerIndex.toString(),
            "correct": "T",
            "div_id": question.id,
            "course_name": eBookConfig.course,
            "clientLoginStatus": true,
            "timezoneoffset": 5,
            "percent": question.scoreMax,
            "assignment_id": assignment_id,
        });
    } else if (question.type === "activecode") {
        return JSON.stringify({
            "act": `percent:100.00:passed:${question.scoreMax}:failed:0`,
            "div_id": question.id,
            "event": "unittest",
            "course_name": eBookConfig.course,
            "clientLoginStatus": true,
            "timezoneoffset": 5,
            "assignment_id": assignment_id
        });
    }
};

// Helper function to submit a single attempt for a question
const submitAttempt = async (question, answerIndex) => {
    const body = createRequestBody(question, answerIndex);
    try {
        const response = await fetch("https://runestone.academy/ns/logger/bookevent", {
            headers: heads,
            referrer: `https://runestone.academy/assignment/student/doAssignment?assignment_id=${assignment_id}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: body,
            method: "POST",
            mode: "cors",
            credentials: "include",
        });
        
        // Wait for DOM to update
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Check if answer is correct
        const isCorrect = document.querySelector(`#${question.id}`).parentNode.classList.contains("isCorrect");
        
        return {
            success: response.status === 201,
            isCorrect: isCorrect
        };
    } catch (error) {
        console.error(`%c❌ Error submitting question ${question.id}: ${error}`, 'color: #FF4444; font-weight: bold;');
        return { success: false, isCorrect: false };
    }
};

// Main function to process all questions
const processQuestions = async () => {
    console.log('%c📝 Found ' + questions.length + ' questions to process', 'color: #8A2BE2; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFF');
    
    for (const question of questions) {
        if (question.type === "multiple choice") {
            const numOptions = document.querySelectorAll(`#${question.id}_form > label`).length;
            let correctAnswerFound = false;
            let correctAnswerIndex = 0;
            
            console.log(`%c🔍 Processing ${question.type} question: ${question.id}`, 'color: #4A90E2; font-weight: bold;');
            
            for (let i = 0; i < numOptions && !correctAnswerFound; i++) {
                const result = await submitAttempt(question, i);
                if (result.success && result.isCorrect) {
                    console.log(`%c✅ Question ${question.id} submitted correctly!`, 'color: #4CAF50; font-weight: bold;');
                    correctAnswerFound = true;
                    correctAnswerIndex = i;
                    
                    // Submit the correct answer a second time
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const secondResult = await submitAttempt(question, correctAnswerIndex);
                    if (secondResult.success) {
                        console.log(`%c🔄 Question ${question.id} resubmitted successfully!`, 'color: #4CAF50; font-style: italic;');
                    }
                }
            }
        } else if (question.type === "activecode") {
            console.log(`%c🔍 Processing ${question.type} question: ${question.id}`, 'color: #4A90E2; font-weight: bold;');
            
            const result = await submitAttempt(question);
            if (result.success) {
                console.log(`%c✅ Question ${question.id} submitted correctly!`, 'color: #4CAF50; font-weight: bold;');
                
                // Submit the correct answer a second time
                await new Promise(resolve => setTimeout(resolve, 1000));
                const secondResult = await submitAttempt(question);
                if (secondResult.success) {
                    console.log(`%c🔄 Question ${question.id} resubmitted successfully!`, 'color: #4CAF50; font-style: italic;');
                }
            }
        }
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FFF');
    }
    
    console.log('%c✨ All questions processed! ✨', 'color: #8A2BE2; font-weight: bold; font-size: 14px;');
};

// Start processing questions
processQuestions();
