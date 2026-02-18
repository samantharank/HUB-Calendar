const SS_TOKEN = '6H6mqoBCvPLLuHhiZf5ao9NNt4CpBi4g9FJHH';
const SS_SHEET = '6179605065977732';
const SS_BASE  = 'https://api.smartsheet.com/2.0';

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const method  = event.httpMethod;
  const params  = event.queryStringParameters || {};
  const rowId   = params.rowId || '';
  const action  = params.action || '';

  // Build Smartsheet URL based on action
  let url;
  if (action === 'sheet') {
    url = `${SS_BASE}/sheets/${SS_SHEET}`;
  } else if (action === 'addcol') {
    url = `${SS_BASE}/sheets/${SS_SHEET}/columns`;
  } else if (action === 'updatecol') {
    url = `${SS_BASE}/sheets/${SS_SHEET}/columns/${params.colId}`;
  } else if (action === 'addrow') {
    url = `${SS_BASE}/sheets/${SS_SHEET}/rows`;
  } else if (action === 'updaterow') {
    url = `${SS_BASE}/sheets/${SS_SHEET}/rows`;
  } else if (action === 'deleterow') {
    url = `${SS_BASE}/sheets/${SS_SHEET}/rows?rowIds=${rowId}`;
  } else {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
  }

  try {
    const fetchOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${SS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    if (event.body && method !== 'GET' && method !== 'DELETE') {
      fetchOptions.body = event.body;
    }

    const res  = await fetch(url, fetchOptions);
    const text = await res.text();

    return {
      statusCode: res.status,
      headers,
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
