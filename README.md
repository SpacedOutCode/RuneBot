# 🚀 RuneBot

A sleek automated solver for Runestone Academy assignments. RuneBot intelligently processes both multiple choice and active code questions with built-in retry mechanisms.

![RuneBot Logo ASCII](https://img.shields.io/badge/RuneBot-Made%20by%20SpacedOutCode-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)

## ⚡ Features

- 📝 Automatic detection and processing of multiple choice questions
- 💻 Handles active code submissions
- 🔄 Smart retry mechanism for better success rates
- 🎨 Beautiful console logging with color-coded status updates
- ⏱️ Built-in delays to prevent rate limiting
- 🔍 Intelligent answer verification

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
3. Watch the console (F12 > Console) for progress updates
4. Wait for all questions to be processed

## ⚙️ How It Works

RuneBot uses a sophisticated approach to handle different question types:

### Multiple Choice Questions:
- Automatically detects number of options
- Systematically tries each option until correct answer is found
- Verifies success through DOM updates
- Resubmits correct answer for verification

### Active Code Questions:
- Submits with 100% completion status
- Includes built-in verification
- Resubmits successful answers for confirmation

## 🎯 Success Indicators

Watch the console for these status indicators:
- 🔍 Question processing started
- ✅ Correct answer submitted
- 🔄 Answer resubmitted successfully
- ❌ Error encountered (with details)

## ⚠️ Disclaimer

This tool is for educational purposes only. Use responsibly and in accordance with your institution's academic policies.

## 📄 License

MIT License - feel free to modify and distribute as needed.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---
Made with 💜 by SpacedOutCode
