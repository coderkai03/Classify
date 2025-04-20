import requests
from bs4 import BeautifulSoup
import json

def scrape_ucr_courses():
    # URL of the course descriptions page
    url = "https://www1.cs.ucr.edu/undergraduate/course-descriptions"
    
    try:
        # Send GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the table - it's likely the main table on the page
        table = soup.find('table')
        
        # Initialize list to store course data
        courses = []
        
        # Skip the header row and process each row
        rows = table.find_all('tr')[1:]  # Skip header row
        for row in rows:
            # Get all td elements in the row
            cols = row.find_all('td')
            
            # Only process rows that have 3 columns
            if len(cols) == 3:
                course = {
                    "course_id": cols[0].get_text(strip=True),
                    "title": cols[1].get_text(strip=True),
                    "description": cols[2].get_text(strip=True)
                }
                courses.append(course)
        
        # Export to JSON file
        with open('ucr_courses.json', 'w', encoding='utf-8') as f:
            json.dump(courses, f, indent=4, ensure_ascii=False)
            
        print(f"Successfully scraped {len(courses)} courses and saved to ucr_courses.json")
        
    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_ucr_courses()