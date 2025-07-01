
## Objective

Build a full-stack application using Laravel with Inertia that demonstrates real-time data updates and a mix of server-side rendered and client-side rendered React components. The application will simulate a transaction viewer with filtering, pagination, and live data integration.

## Brief
In this challenge you’ll develop a web application that displays a list of transactions. The solution should include a Laravel back-end utilizing Inertia.js to serve React pages and a mechanism to integrate live updates (either via API polling or WebSockets). The final product will provide a seamless user experience for viewing and filtering transactions in real time.

Task 1 – Database Schema & Data Seeding
    - Create a MySQL table named "transactions" with the following schema:
        - id: primary key, auto-increment integer
        - timestamp: datetime
        - amount: decimal (suitable precision to represent monetary values)
        - description: string (varchar)
        - accountType: string (varchar, e.g., "checking", "savings", "credit")
    - Seed the table with at least 10 sample records to simulate transaction data.

Task 2 – Live Data Integration (Polling or WebSockets)
    - Implement a method to periodically fetch new transaction data. You may choose one of the following approaches:
        - API Polling: Create an endpoint that returns new transaction records, and configure the front-end to poll this endpoint every 30 seconds.
        - WebSockets: If experienced, set up a WebSocket connection so that new transaction records (formatted as per the schema above) are automatically pushed to the client every 30 seconds.
    - Ensure that the new transactions follow the same format as those initially seeded in the database.
    - Include a mechanism (e.g., a simple script or in-app log) to demonstrate that new transactions are being received.

Task 3 – Front-End React with SSR and Client-Side Interactivity
    - Using React with Inertia, create a single-page interface that initially renders the transactions table server-side.
        - The table should display columns for timestamp, amount, description, and account type.
        - Ensure transactions appear in descending order by timestamp.
    - Enhance the application with client-side React components that include:
        - A filter control (dropdown) to select an account type. When a user selects an account type, the display should update dynamically to show only matching transactions.
        - Integration with the live data mechanism (polling or WebSocket):
            - Update the transactions list in real time as new data comes in.
            - Insert new transactions at the top of the table if they meet the current filter criteria.
    - Guarantee a clear separation between the content rendered server-side and components further enhanced on the client side.

Task 4 – Optional User Interface Enhancements
    - Implement pagination on the transactions table to display a limited number of records per page (e.g., 5 records per page) with navigation controls to switch pages.
    - Add a summary section that calculates and displays the total sum of the transaction amounts visible on the current page (taking into account any active filters).
    - Ensure the overall layout is responsive and visually accessible.

Bonus Objectives
    - Configure a Docker environment to run the Laravel application along with separate services (if using a standalone service for WebSockets or additional tooling).
    - Enhance error handling to display user-friendly messages when live data retrieval fails (e.g., connection lost or API unresponsive).
    - Utilize TypeScript within the React components to improve code quality and maintainability.
    - Include unit tests for critical React and/or PHP components covering data fetching, filtering, and real-time update handling.

### Evaluation Criteria
    - Clarity and organization of your code across Laravel and React.
    - Proper integration of Laravel with Inertia and effective use of React for both SSR and client-side interactivity.
    - Implementation of live data integration either through API polling or WebSockets, ensuring real-time UI updates.
    - Responsiveness, usability, and visual cleanliness of the user interface.
    - Clear project structure, and setup instructions.

### Getting Started
    - Laravel Herd makes it easy to set up and run your application: https://herd.laravel.com/
    - The React Starter Kit for Laravel should have you up and running quickly: https://laravel.com/docs/12.x/starter-kits#react
    - The starter kit will setup a basic layout using Laravel Inertia: https://inertiajs.com/

### CodeSubmit 

Please organize, design, test, and document your code as if it were going into production - then push your changes to the master branch.

Have fun coding! 🚀

The HomeSource Team
