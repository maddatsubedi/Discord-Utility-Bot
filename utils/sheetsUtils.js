const { google } = require('googleapis');
const credentials = require('../trape-327504-ce5999dc2d27.json'); // Replace with the path to your credentials file

const { clientId } = require('../config.json');

const SPREADSHEET_ID = '1V6GTNDzoIWG_ELy2Af_KnI5uN63MFXNXuwNZMe4lpUY';

const appendToSheet = async (sheetName, range, data) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Get the values in the specified range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    });

    const values = response.data.values;

    let emptyRowIndex = values.length; // Assuming the first empty row is at the end of the range

    // Find the index of the first empty row
    for (let i = 0; i < values.length; i++) {
      if (!values[i].some(cell => !!cell)) {
        emptyRowIndex = i;
        break;
      }
    }

    // Append the data to the first empty row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${emptyRowIndex + 1}`, // Add 1 because row indices are 1-based in Sheets API
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data.split(',.,')],
      },
    });

    // console.log(`Data appended to row ${emptyRowIndex + 1}.`);
  } catch (error) {
    console.error('The API returned an error AS:', error);
  }
};

// const appendToSheet = async (sheetName, range, data) => {
//   const auth = await google.auth.getClient({
//     credentials,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//   });

//   const sheets = google.sheets({ version: 'v4', auth });

//   try {
//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: `${sheetName}!${range}`,
//       valueInputOption: 'USER_ENTERED',
//       resource: {
//         values: [data.split(',.,')],
//       },
//     });

//     // console.log(`${response.data.updates.updatedCells} cells appended.`);
//   } catch (error) {
//     console.error('The API returned an error AS:', error);
//   }
// };

const getSheetData = async (sheetName, range) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    });

    const rows = response.data.values;
    if (rows.length) {
      return rows.slice(1);
    } else {
      return [];
    }
  } catch (error) {
    console.error('The API returned an error GSD:', error);
    return [];
  }
};

const getFullSheetData = async (sheetName, range) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    });

    const rows = response.data.values;
    if (rows.length) {
      return rows;
    } else {
      return [];
    }
  } catch (error) {
    console.error('The API returned an error GSD:', error);
    return [];
  }
};

const updateUserData = async (sheetName, userId, reason, count, moderator, moderatorId) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:H`,
    });

    const rows = response.data.values;
    if (rows.length > 1) {
      const rowIndex = rows.findIndex((row) => row[1] === userId);
      if (rowIndex > 0) {
        const date = new Date().toUTCString();
        rows[rowIndex][2] = moderator; // Update the 'Moderator' column
        rows[rowIndex][3] = moderatorId; // Update the 'Moderator' column
        rows[rowIndex][4] = reason; // Update the 'Reason' column
        rows[rowIndex][5] = count; // Update the 'Count' column
        rows[rowIndex][6] = date; // Update the 'Date' column

        const updateResponse = await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A${rowIndex + 1}:H${rowIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [rows[rowIndex]],
          },
        });

        // console.log(`${updateResponse.data.updatedCells} cells updated.`);
      } else {
        console.log('User not found.');
      }
    } else {
      console.log('No data found.');
    }
  } catch (error) {
    console.error('The API returned an error:', error);
  }
};

const updateSheetData = async (sheetName, messageId, lastMessageId) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:D`,
    });

    const rows = response.data.values;
    if (rows.length > 1) {
      const rowIndex = rows.findIndex((row) => row[2] === messageId);
      if (rowIndex > 0) {
        const date = new Date().toUTCString();
        rows[rowIndex][2] = lastMessageId; // Update the 'Moderator' column

        const updateResponse = await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A${rowIndex + 1}:H${rowIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [rows[rowIndex]],
          },
        });

        // console.log(`${updateResponse.data.updatedCells} cells updated.`);
      } else {
        console.log('User not found.');
      }
    } else {
      console.log('No data found.');
    }
  } catch (error) {
    console.error('The API returned an error:', error);
  }
};

const updateSurveyData = async (sheetName, status, newstatus) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:D`,
    });

    const rows = response.data.values;
    if (rows.length > 1) {
      const rowIndex = rows.findIndex((row) => row[2] === status);
      if (rowIndex > 0) {
        const date = new Date().toUTCString();
        rows[rowIndex][2] = newstatus; // Update the 'Moderator' column

        const updateResponse = await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A${rowIndex + 1}:H${rowIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [rows[rowIndex]],
          },
        });

        // console.log(`${updateResponse.data.updatedCells} cells updated.`);
      } else {
        console.log('Survey data not found.');
      }
    } else {
      console.log('No data found.');
    }
  } catch (error) {
    console.error('The API returned an error:', error);
  }
};

// const createSheet = async (sheetName) => {
//   try {
//     const auth = await google.auth.getClient({
//       credentials,
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth });

//     // Add a new sheet to the spreadsheet
//     await sheets.spreadsheets.batchUpdate({
//       spreadsheetId: SPREADSHEET_ID,
//       resource: {
//         requests: [{
//           addSheet: {
//             properties: {
//               title: sheetName,
//             },
//           },
//         }],
//       },
//     });


//     // Append data to the first row
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: `${sheetName}!A1:G1`, // First row range
//       valueInputOption: 'USER_ENTERED',
//       resource: {
//         values: [['User', 'User ID', 'Channel', 'Channel ID', 'Vote', 'Date', 'Remarks']],
//       },
//     });

//     // console.log('Data appended to the first row successfully.');
//   } catch (error) {
//     console.error('The API returned an error:', error);
//   }
// };

const createSheet = async (sheetName, headers) => {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Add a new sheet to the spreadsheet
    const createSheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        }],
      },
    });

    const sheetId = createSheetResponse.data.replies[0].addSheet.properties.sheetId;

    // Append headers to the first row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:G1`, // Assuming 7 columns for the headers
      valueInputOption: 'RAW',
      resource: {
        values: [headers],
      },
    });


    // Apply formatting to make headers bold and centered
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [{
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: headers.length,
            },
            cell: {
              userEnteredFormat: {
                horizontalAlignment: 'CENTER',
                textFormat: {
                  bold: true,
                },
              },
            },
            fields: 'userEnteredFormat(horizontalAlignment,textFormat)',
          },
        }],
      },
    });

  } catch (error) {
    console.error('The API returned an error CS:', error);
  }
};

const checkSheetExists = async (sheetName) => {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    // Check if the sheet with the given name exists
    const sheetExists = spreadsheet.data.sheets.some(s => s.properties.title === sheetName);

    return sheetExists;
  } catch (error) {
    console.error('The API returned an error CSE:', error);
    return false;
  }
};

// Example usage:
// checkSheetExists('SheetNameToCheck');


const deleteSheet = async (sheetName) => {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    // Find the sheet with the given name
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === sheetName);

    if (sheet) {
      // Delete the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [{
            deleteSheet: {
              sheetId: sheet.properties.sheetId,
            },
          }],
        },
      });

      // console.log(`Sheet '${sheetName}' deleted successfully.`);
    } else {
      // console.log(`Sheet '${sheetName}' not found.`);
    }
  } catch (error) {
    console.error('The API returned an error DS:', error);
  }
};

const deleteRowByChannelId = async (sheetName, channelId) => {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the sheet properties to retrieve the sheet ID
    const sheetProperties = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetId = sheetProperties.data.sheets.find(sheet => sheet.properties.title === sheetName)?.properties.sheetId;

    if (!sheetId) {
      console.error(`Sheet '${sheetName}' not found.`);
      return;
    }

    // Get all the data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:D`, // Adjust the range as needed
    });

    
    const values = response.data.values;

    // Filter out the rows with the specified channel ID in the second column
    const rowsToRemove = values.filter(row => row[1] === channelId);

    if (rowsToRemove.length > 0) {
      // Create a batch update request to clear the contents of the rows
      const batchUpdateRequest = {
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: rowsToRemove.map(row => ({
            updateCells: {
              range: { sheetId: sheetId, startRowIndex: values.indexOf(row), endRowIndex: values.indexOf(row) + 1, startColumnIndex: 0, endColumnIndex: row.length },
              fields: 'userEnteredValue', // Clear user entered value
            },
          })),
        },
      };

      // Execute the batch update request
      await sheets.spreadsheets.batchUpdate(batchUpdateRequest);
    } else {
      console.log(`No data found for Channel ID ${channelId}.`);
    }
  } catch (error) {
    console.error('The API returned an error:', error);
  }
};

const deleteRowByIdSurvey = async (sheetName, channelId) => {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the sheet properties to retrieve the sheet ID
    const sheetProperties = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetId = sheetProperties.data.sheets.find(sheet => sheet.properties.title === sheetName)?.properties.sheetId;

    if (!sheetId) {
      console.error(`Sheet '${sheetName}' not found.`);
      return;
    }

    // Get all the data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:F`, // Adjust the range as needed
    });

    
    const values = response.data.values;

    // Filter out the rows with the specified channel ID in the second column
    const rowsToRemove = values.filter(row => row[1] === channelId);

    if (rowsToRemove.length > 0) {
      // Create a batch update request to clear the contents of the rows
      const batchUpdateRequest = {
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: rowsToRemove.map(row => ({
            updateCells: {
              range: { sheetId: sheetId, startRowIndex: values.indexOf(row), endRowIndex: values.indexOf(row) + 1, startColumnIndex: 0, endColumnIndex: row.length },
              fields: 'userEnteredValue', // Clear user entered value
            },
          })),
        },
      };

      // Execute the batch update request
      await sheets.spreadsheets.batchUpdate(batchUpdateRequest);
    } else {
      console.log(`No data found for Channel ID ${channelId}.`);
    }
  } catch (error) {
    console.error('The API returned an error:', error);
  }
};


module.exports = { appendToSheet, getSheetData, getFullSheetData, updateUserData, updateSheetData, updateSurveyData, createSheet, deleteSheet, checkSheetExists, deleteRowByChannelId, deleteRowByIdSurvey };