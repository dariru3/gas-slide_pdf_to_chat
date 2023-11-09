# gas-slide_pdf_to_chat
Save Google Slide as PDF, send to Google Chat with message


# Google Sheets Custom Chat Message Script
![DALL·E 2023-11-09 20 28 37 - A digital illustration of a flat icon-style sales robot on fire  The robot is characterized by a business-like appearance, with a tie and a small brie](https://github.com/dariru3/gas-slide_pdf_to_chat/assets/107824734/c192afb9-f32c-4085-91ac-bd951c185897)


This script is designed to automate the process of sending messages to a Google Chat room based on specific dates listed in a Google Sheet. The script checks for today's date, and if it matches any date listed in the Sheet, a pre-defined message from the Sheet along with a PDF is sent to the specified Google Chat room.

## Features

- **Automated Date Check**: Automatically checks if today's date is on the list of dates in the Google Sheet.
- **Message Retrieval**: Retrieves a pre-defined message from the Sheet to be sent.
- **PDF Creation**: Creates a PDF from a Google Slide and attaches its link in the message.
- **Google Chat Integration**: Sends the message with the PDF link to a specified Google Chat room.
- **Manual Trigger**: Provides an option in the Google Sheets UI to manually send the message.

## Configuration

1. **Setup `CONFIG` Object**: Ensure all necessary parameters are defined in the `CONFIG` object. This includes:
   - Google Slide ID
   - Google Drive Folder ID for saving the PDF
   - Webhook URL for Google Chat room
   - Names of the sheets used

2. **Set Up Sheets**: Ensure the Google Sheet has the required sheets named as per `CONFIG` and:
   - "配信日時" sheet has the list of dates in column A.
   - "チャット文章" sheet has the message to be sent in cell A1.

3. **Authorization**: The script requires authorization to read the Sheet, create a PDF, and send a message to Google Chat. Ensure you provide the necessary permissions when prompted.

4. **Schedule**: If you wish to automate the process weekly, set up a time-driven trigger in Google Apps Script to run the `weeklyCheckAndSend` function.

## Manual Usage
- In the Google Sheet, navigate to the custom menu "Test Menu" and click on "Send Message+PDF" to manually trigger the script.

![DX 商戦カレンダー](https://github.com/dariru3/gas-slide_pdf_to_chat/assets/107824734/95d9324c-a18a-4141-a9c8-0e31ab8861de)
