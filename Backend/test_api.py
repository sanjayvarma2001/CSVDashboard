import requests
import json

# Test the chat endpoint
try:
    # First get a report
    response = requests.get('http://127.0.0.1:8000/reports/recent')
    if response.status_code == 200:
        reports = response.json()
        if reports:
            report_id = reports[0]['id']
            print(f"Testing chat with report {report_id}")
            
            # Send a chat message
            chat_response = requests.post(
                f'http://127.0.0.1:8000/reports/{report_id}/chat',
                json={"message": "What are the key metrics in this dataset?"}
            )
            
            if chat_response.status_code == 200:
                data = chat_response.json()
                print(f"Chat response received!")
                print(f"Response: {data['response'][:100]}...")
                print(f"History entries: {len(data['history'])}")
                if data['history']:
                    print(f"Sample message: {json.dumps(data['history'][0], indent=2)[:200]}")
            else:
                print(f"Chat failed: {chat_response.status_code}")
                print(f"Error: {chat_response.text}")
except Exception as e:
    print(f"Error: {e}")
