// Modify the styles - remove logs container and add status text styling
const styles = `
 @import url('https://fonts.googleapis.com/css2?family=Konkhmer+Sleokchher&display=swap');
 @import url('https://fonts.googleapis.com/css2?family=Konkhmer+Sleokchher&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
  .runebot-container {
    width: 400px;
    height: 300px;
    top: 25px;
    left: 25px;
    position: fixed;
    background: #202125;
    border-radius: 8px;
    border: 1px #1a1b22 solid;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 8px;
    z-index: 999999;
  }
  .runebot-title {
    text-align: center;
    color: #e5e5f8;
    font-size: 48px;
    font-family: "Konkhmer Sleokchher";
    font-weight: 400;
    word-wrap: break-word;
    width: fit-content;
    padding: 0;
    line-height: 0.85;
  }
  .runebot-subtitle {
    text-align: center;
    color: #808080;
    font-size: 12px;
    font-family: "Konkhmer Sleokchher";
    font-weight: 400;
    word-wrap: break-word;
    width: fit-content;
  }
  .runebot-start-button {
    background: #8c50fd;
    border-radius: 6px;
    text-align: center;
    color: #e5e5f8;
    font-size: 11px;
    font-family: "Konkhmer Sleokchher";
    font-weight: 400;
    word-wrap: break-word;
    border: none;
    padding: 8px 16px;
    width: fit-content;
  }
.runebot-console {
  background: #0E0F13; 
  color: #fff;
  border-radius: 4px;
  width: 100%;
  height: 100%; // <- Added semicolon here
  font-family: "Roboto Mono", serif;
  font-size: 12px;
  overflow-y: scroll;
  padding: 6px;
}
  
.runebot-console::-webkit-scrollbar {
  width: 4px;
}

.runebot-console::-webkit-scrollbar-track {
  background: #0E0F13; 
}

.runebot-console::-webkit-scrollbar-thumb {
  background:rgb(24, 25, 31); 
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create the GUI container
const container = document.createElement("div");
container.className = "runebot-container";
container.innerHTML = `<div class="runebot-title">RuneBot</div>
  <div class="runebot-subtitle">v1.0 Made by SpacedOutCode</div>
  <button class="runebot-start-button" onclick="startBot()">Start Bot</button>
  <div class="runebot-console"></div>`;
document.body.appendChild(container);

// Make the window draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;

// Changed from container.addEventListener to title element
document
  .querySelector(".runebot-title")
  .addEventListener("mousedown", dragStart);
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

  const statusDiv = document.querySelector(".runebot-console");
  statusDiv.innerHTML += `${String(message).replace(/%c/g, "")}<br>`;
  statusDiv.scrollTop = statusDiv.scrollHeight;
};

const types = {
  "multiple choice": "multiple choice",
  parsons: "parsons",
  activecode: "activeCode",
  "fill in the blank": "fill in the blank",
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

/*
 *     HELPER FUNCTIONS
 */

// Function to get the Parsons hash
const parsonsHash = (prob) => {
  var hash = [];
  var blocks = prob.solutionBlocks();
  for (var i = 0; i < blocks.length; i++) {
    var blockHash = [];
    for (var j = 0; j < blocks[i].lines.length; j++) {
      var line = blocks[i].lines[j];
      var lineIndex = line.index;
      var correctIndent = line.indent;
      blockHash.push(lineIndex + "_" + correctIndent);
    }
    hash.push(blockHash.join("-"));
  }
  if (hash.length === 0) {
    return "-";
  } else {
    return hash.join("-");
  }
};

// Function to get the question type
const getType = (caption) => {
  if (!caption) return "unknown";
  const lowerCaption = caption.toLowerCase();
  return (
    types[Object.keys(types).find((key) => lowerCaption.includes(key))] ||
    "unknown"
  );
};

// Function to get the answer
const getAnswer = (prob) => {
  switch (getType(prob.caption)) {
    case "multiple choice":
      let ans = [];
      prob.answerList?.forEach((answer, index) => {
        if (answer.correct) ans.push(index);
      });
      return `answer:${ans.length > 0 ? ans.join(",") : "0"}:correct`;
    case "fill in the blank":
        try {
          const fitb = prob.feedbackArray[0][0];
          return fitb.number?.[0] || fitb.replace(/\s*/g, "");
        } catch {
          return "ANSWER_UNDEFINED";
        }
    case "parsons":
      return `correct|-|${parsonsHash(prob)}|c1-s`;
    case "activeCode":
      return "Error: Unsupported type";
    default:
      return -1;
  }
};

// Function to create the request body
const createBody = (prob) => {
  switch (prob.type) {
    case "multiple choice":
      return JSON.stringify({
        event: "mChoice",
        act: prob.answer,
        answer: prob.rawAnswer,
        correct: "T",
        div_id: prob.id,
        course_name: eBookConfig.course,
        clientLoginStatus: true,
        timezoneoffset: 5,
        percent: prob.max,
        assignment_id: assignment_id,
      });
      case "fill in the blank":
        return JSON.stringify({
          event: "fillb",
          div_id: prob.id,
          act: prob.answer,
          answer: prob.answer,
          correct: "T",
          percent: prob.max,
          course_name: eBookConfig.course,
          clientLoginStatus: true,
          timezoneoffset: 5,
          assignment_id: assignment_id,
        });
    case "parsons":
      return JSON.stringify({
        event: "parsons",
        act: prob.answer,
        answer: prob.rawAnswer,
        div_id: prob.id,
        source: "-",
        adaptive: "c1-s",
        correct: "T",
        course_name: eBookConfig.course,
        clientLoginStatus: true,
        timezoneoffset: 5,
        assignment_id: assignment_id,
        percent: prob.max,
      });
    case "activeCode":
      return JSON.stringify({
        act: `percent:100.00:passed:${prob.max}:failed:0`,
        div_id: prob.id,
        event: "unittest",
        course_name: eBookConfig.course,
        clientLoginStatus: true,
        timezoneoffset: 5,
        assignment_id: assignment_id,
      });
  }
};

/*
 *     MAIN FUNCTIONS
 */

// Get the assignment ID
const assignment_id = new URLSearchParams(window.location.search).get(
  "assignment_id"
);

// Initialize empty array for all questions
let problems = [];

problems = window.allComponents
  .filter((comp) => comp.divid)
  .map((prob) => {
    const type = getType(prob.caption);
    let answer, rawAnswer;

    if (type === "multiple choice") {
      const ansIndices = [];
      prob.answerList?.forEach((ans, idx) => {
        if (ans.correct) ansIndices.push(idx);
      });
      answer = `answer:${ansIndices.join(",") || "0"}:correct`;
      rawAnswer = ansIndices.join(",") || "0";
    } else if (type === "fill in the blank") {
      rawAnswer = getAnswer(prob);
      answer = `[\"${rawAnswer}\"]`;
    } else if (type === "parsons") {
      answer = `correct|-|${parsonsHash(prob)}|c1-s`;
      rawAnswer = parsonsHash(prob);
    } else {
      answer = getAnswer(prob);
      rawAnswer = `${prob.answer}`;
    }

    return {
      id: prob.divid,
      type: type,
      answer: answer,
      rawAnswer: rawAnswer,
      max: prob.percent ? prob.percent : 1,
      isCorrect: prob.correct,
    };
  });

// Start the bot
const startBot = () => {
  problems.forEach((prob) => {
    if (types[prob.type] && !prob.isCorrect) {
      // Check if prob.type is a key in the types object
      const body = createBody(prob);
      fetch("https://runestone.academy/ns/logger/bookevent", {
        method: "POST",
        headers: heads,
        body: body,
      })
        .then((response) =>
          console.log(
            response.status === 201
              ? `Answered ${prob.id} successfully`
              : "Error"
          )
        )
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });

  fetch("https://runestone.academy/runestone/assignments/student_autograde", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      priority: "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      Referer: `https://runestone.academy/assignment/student/doAssignment?assignment_id=${assignment_id}`,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `assignment_id=${assignment_id}`,
    method: "POST",
  });
  window.location.reload();
};
