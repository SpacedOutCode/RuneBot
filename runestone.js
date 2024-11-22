// Modify the styles - remove logs container and add status text styling
const styles = `
.runebot-container {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 400px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    color: white;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.runebot-header {
    padding: 10px;
    border-radius: 8px 8px 0 0;
    cursor: move;
    user-select: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.runebot-header img {
    width: 90%;
}

.runebot-creator {
    text-align: center;
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
}

.runebot-button {
    display: block;
    width: 90%;
    margin: 10px auto;
    padding: 10px;
    background: #8A2BE2;
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.runebot-button:hover {
    background: #9A3FF2;
}

.runebot-status {
    text-align: center;
    padding: 10px;
    font-size: 14px;
    margin-bottom: 10px;
    transition: color 0.3s ease;
}

/* Add specific status colors */
.status-info { color: #4A90E2; }     /* Blue for processing */
.status-success { color: #4CAF50; }   /* Green for success */
.status-special { color: #8A2BE2; }   /* Purple for special messages */
.status-error { color: #FF4444; }     /* Red for errors */`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create the GUI container
const container = document.createElement("div");
container.className = "runebot-container";

// Add the header (draggable area)
const header = document.createElement("div");
header.className = "runebot-header";

// Add creator text
const creatorDiv = document.createElement("div");
creatorDiv.className = "runebot-creator";
creatorDiv.textContent = "Made by SpacedOutCode";

// Add the button
const button = document.createElement("button");
button.className = "runebot-button";
button.textContent = "Answer All";

// Add status text div
const statusDiv = document.createElement("div");
statusDiv.className = "runebot-status";

// Assemble the GUI
header.innerHTML = `
<img src="https://spaced.gg/assets/logoLarge.png" alt="Spaced" />
`;
header.appendChild(creatorDiv);
container.appendChild(header);
container.appendChild(button);
container.appendChild(statusDiv);
document.body.appendChild(container);

// Make the window draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;

header.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

function dragStart(e) {
  initialX = e.clientX - container.offsetLeft;
  initialY = e.clientY - container.offsetTop;
  isDragging = true;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    container.style.left = currentX + "px";
    container.style.top = currentY + "px";
  }
}

function dragEnd() {
  isDragging = false;
}

// Override console.log for the script
const originalLog = console.log;
console.log = function (message, style = "") {
  originalLog.apply(console, arguments);

  // Clean the message from CSS formatting
  const cleanMessage =
    typeof message === "string" ? message.replace(/%c/g, "").trim() : message;

  // Remove all status classes first
  statusDiv.classList.remove(
    "status-info",
    "status-success",
    "status-special",
    "status-error"
  );

  // Add appropriate class based on the style
  if (style.includes("#4A90E2")) {
    statusDiv.classList.add("status-info");
  } else if (style.includes("#4CAF50")) {
    statusDiv.classList.add("status-success");
  } else if (style.includes("#8A2BE2")) {
    statusDiv.classList.add("status-special");
  } else if (style.includes("#FF4444")) {
    statusDiv.classList.add("status-error");
  }

  statusDiv.textContent = cleanMessage;
};

const heads = {
  accept: "application/json",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json; charset=utf-8",
  priority: "u=1, i",
  "sec-ch-ua":
    '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};

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
      scoreMax: document.querySelector(`#${questionId}_score > span.qmaxscore`)
        ? parseInt(
            document.querySelector(`#${questionId}_score > span.qmaxscore`)
              .innerText
          )
        : 1,
    });
  } else if (divText.includes("activecode")) {
    questions.push({
      id: questionId,
      type: "activecode",
      scoreMax: document.querySelector(`#${questionId}_score > span.qmaxscore`)
        ? parseInt(
            document.querySelector(`#${questionId}_score > span.qmaxscore`)
              .innerText
          )
        : 1,
    });
  } else if (divText.includes("fill in the blank")) {
    questions.push({
      id: questionId,
      type: "fill in the blank",
      scoreMax: document.querySelector(`#${questionId}_score > span.qmaxscore`)
        ? parseInt(
            document.querySelector(`#${questionId}_score > span.qmaxscore`)
              .innerText
          )
        : 1,
    });
  }
});

// Helper function to create body for requests
const createRequestBody = (question, answerIndex = 0, answer) => {
  let regex = new RegExp(`[s*^$\]`, "g");
  let multiSelect = ""; 

  if (window.componentMap[question.id].answer !== undefined) {
    window.componentMap[question.id].answerList.forEach((answer) => {
      if (answer.correct) {
         multiSelect = multiSelect + window.componentMap[question.id].answerList.indexOf(answer) + ",";
      }
    });
    multiSelect = multiSelect.slice(0, -1);
} else {
    multiSelect = answerIndex;
}

  if (question.type === "multiple choice") {
        return JSON.stringify({
            event: "mChoice",
            act: `answer:${multiSelect}:correct`,
            answer: multiSelect,
            correct: "T",
            div_id: question.id,
            course_name: eBookConfig.course,
            clientLoginStatus: true,
            timezoneoffset: 5,
            percent: question.scoreMax,
            assignment_id: assignment_id,
          });
  } else if (question.type === "activecode") {
    return JSON.stringify({
      act: `percent:100.00:passed:${question.scoreMax}:failed:0`,
      div_id: question.id,
      event: "unittest",
      course_name: eBookConfig.course,
      clientLoginStatus: true,
      timezoneoffset: 5,
      assignment_id: assignment_id,
    });
  } else if (question.type === "fill in the blank") {
    return JSON.stringify({
      event: "fillb",
      div_id: question.id,
      act: JSON.stringify([
        answer.regex
          ? answer.regex.replace(regex, "").replaceAll("\\", "")
          : answer.number[0],
      ]),
      answer: JSON.stringify([
        answer.regex
          ? answer.regex.replace(regex, "").replaceAll("\\", "")
          : answer.number[0],
      ]),
      correct: "T",
      percent: 1,
      course_name: eBookConfig.course,
      clientLoginStatus: true,
      timezoneoffset: 5,
      assignment_id: assignment_id,
    });
  }
};

const localStorageKey = (id) => {
  return eBookConfig.email + ":" + eBookConfig.course + ":" + id + "-given";
};

// Helper function to submit a single attempt for a question
const submitAttempt = async (question, answerIndex, answer) => {
  const body = createRequestBody(question, answerIndex, answer);
  try {
    const response = await fetch(
      "https://runestone.academy/ns/logger/bookevent",
      {
        headers: heads,
        referrer: `https://runestone.academy/assignment/student/doAssignment?assignment_id=${assignment_id}`,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: body,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error(
      `%c❌ Error submitting question ${question.id}: ${error}`,
      "color: #FF4444; font-weight: bold;"
    );
    return { success: false, isCorrect: false };
  }
};

const processQuestions = async () => {
  console.log(
    "%c📝 Found " + questions.length + " questions to process",
    "color: #8A2BE2; font-weight: bold;"
  );

  for (const question of questions) {
      if (question.type === "multiple choice") {
        console.log(
          `%c🔍 Processing ${question.type} question: ${question.id}`,
          "color: #4A90E2; font-weight: bold;"
        );
        let correctAnswerFound = false;

        let answers = window.componentMap[question.id].answerList;
        for (answer of answers) {
          if (answer.correct) {
            submitAttempt(question, answers.indexOf(answer));
            correctAnswerFound = true;
            console.log(
              `%c✅ Question ${question.id} submitted correctly!`,
              "color: #4CAF50; font-weight: bold;"
            );
            break;
          }
        }

        if (!correctAnswerFound) {
          console.log(
            `%c❌ Could not find correct answer for ${question.id}`,
            "color: #FF4444; font-weight: bold;"
          );
        }
      } else if (question.type === "fill in the blank") {
        submitAttempt(
          question,
          0,
          window.componentMap[question.id].feedbackArray[0][0]
        );
        correctAnswerFound = true;
        console.log(
          `%c✅ Question ${question.id} submitted correctly!`,
          "color: #4CAF50; font-weight: bold;"
        );
      }
  }

  location.reload();
  console.log(
    "%c✨ All questions processed! ✨",
    "color: #8A2BE2; font-weight: bold; font-size: 14px;"
  );
};

button.addEventListener("click", () => {
  button.disabled = true;
  button.textContent = "Processing...";
  console.log("⚡ Starting RuneBot...");
  processQuestions().then(() => {
    button.textContent = "Completed!";
  });
});
