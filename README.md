# 🚀 RuneBot

A sleek automated assistant for Runestone Academy assignments. RuneBot provides an intuitive GUI interface to help process a variety of questions.

![RuneBot Logo ASCII](https://img.shields.io/badge/RuneBot-Made%20by%20SpacedOutCode-blueviolet)

## ⚡ Features

- 🎨 Modern draggable GUI interface with status updates
- 📝 Automatic detection and processing of multiple-choice questions (soon to be all questions)
- 🛡️ Built-in error handling and status reporting
- 🎨 Sleek dark theme design with purple accents

## 🔧 Installation

### Bookmarklet Setup

1. Create a new bookmark in your browser
2. Name it "RuneBot"
3. Copy the following code into the URL/location field:

```javascript
javascript:'use%20strict'%3Bvar%20id%3D%22a912b7f4a07202c612b694d66d8165cf%22%2Cfile%3D%22runestone.js%22%2Cuser%3D%22SpacedOutCode%22%2Cxhr%3Dnew%20XMLHttpRequest%3Bxhr.overrideMimeType(%22application%2Fjson%22)%3Bxhr.open(%22GET%22%2C%22https%3A%2F%2Fgist.githubusercontent.com%2F%22%2Buser%2B%22%2F%22%2Bid%2B%22%2Fraw%2F%22%2Bfile%2B%22%3F%22%2BMath.random())%3Bxhr.onreadystatechange%3Dfunction()%7Bif(xhr.readyState%3D%3D%3D4)if(xhr.status%3D%3D%3D200)console.log(%22Successfully%20loaded%20gist%3A%22%2C%7Bid%2Cfile%2Cuser%2Cresponse%3Axhr.responseText%7D)%2C(0%2Ceval)(xhr.responseText)%3Belse%7Bvar%20a%3D%22GitHub%20Gist%20file%20did%20not%20load%20successfully%20and%20instead%20returned%20a%20status%20code%20of%20%22%2Bxhr.status%2B%22.%22%3Bconsole.error(a%2C%7Bid%2Cfile%2Cuser%7D)%3Balert(a)%7D%7D%3Bxhr.send(null)%3Bvoid+0
```

## 📝 Usage Instructions

1. Navigate to your Runestone Academy assignment page
2. Click the "RuneBot" bookmark you created
3. A draggable GUI window will appear in the top-left corner
4. Click the "Start Bot" button to begin processing
5. Watch the status updates in real-time
6. Page will automatically refresh when complete

## ⚙️ Extras

### Oneliner #1
A oneliner that finds the correct answer in a runestone test paste it in and it will log a object with an id like "obj_sde1_optb"; That's the correct answer. To find the component ID, type `window.componentMap[` into the devTools Console an you should see an id with a name that relates to the topic/s of your test. Copy that id and paste it into the `[COMPONENT_ID]` part of the below code.

`window.componentMap['[COMPONENT_ID]'].renderedQuestionArray[parseInt(document.querySelector("li.active a").textContent)-1].question.answerList.find((q) => q.correct)`

### GUI Features:
- Draggable interface for better user experience
- Custom styling with a dark theme
- 
## ⚠️ Important Notes

- The script is designed to work with multiple-choice, fill in the blank, and parsons questions
- Requires a valid Runestone Academy login session
- Uses the official Runestone Academy API endpoints (may break if they update anything)
- Automatically refreshes the page after completion

## 📄 License & Copyright

Copyright © 2024 SpacedOutCode. All rights reserved.

This software is released under a custom license that requires:
1. Mandatory attribution to SpacedOutCode
2. No commercial use without explicit permission
3. All modifications must be marked as derivatives
4. The SpacedOutCode branding in the GUI must be maintained
5. Distribution requires prior notification to the original author

For licensing inquiries or permissions beyond these terms, please contact SpacedOutCode.

## ⚠️ Disclaimer

This tool is for educational purposes only. Use responsibly and per your institution's academic policies.


## 🤝 Contributing

Feel free to submit issues and enhancement requests! The code is structured for easy modifications and improvements.

---
Made with 💜 by [SpacedOutCode](https://spaced.gg/)
