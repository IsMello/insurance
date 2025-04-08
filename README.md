# Insurance API

A small API to get insurance quotes.

## Prerequisites

Before deploying the project, ensure you have the following installed and configured:

1. **AWS CLI**: Set up and configure an AWS account with the AWS CLI.
   - [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
   - Run `aws configure` to set up your credentials.
2. **Docker** (or Podman): Required for running a local database if needed.
   - [Docker Installation Guide](https://docs.docker.com/get-docker/)
   - [Podman Installation Guide](https://podman.io/getting-started/installation)
3. **Node.js**: Ensure you have Node.js installed (version 16 or higher).
   - [Node.js Installation Guide](https://nodejs.org/)

---

## Deployment Steps

Follow these steps to deploy the project:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd insurance


### 2. Install Dependencies
After cloning the repository, install the required dependencies by running:

```bash
npm install
```

This will install all the necessary packages for the project, including those required for deployment and local development.


### 3. Deploy the Project
Run the following command to deploy the project to AWS:

```bash
npm run deploy
```

This will:
- Create an API with two endpoints:
  - `GET /` (for getting quotes)
  - `POST /select-quote` (for selecting a quote)
- Set up an Aurora MySQL database.
- Create a VPC and a Lambda function for running migrations.

---

### 4. Run the Database Migration
After deploying the project, you need to run the database migrations to set up the required tables. Invoke the `migrationRunner` Lambda function using the AWS CLI:

```bash
aws lambda invoke --function-name migrationRunnerFunction response.json
```

This will create the necessary tables in the database.

---

### 5. Test the API
You can now test the API endpoints using tools like `curl`, Postman, or any HTTP client.

#### **Get Quote** (`GET /`)
- **Example Request**:
  ```bash
  curl -X GET <api-url> -H "Content-Type: application/json" -d '{
    "productId": "term-life",
    "state": "PA",
    "sex": "M",
    "dateOfBirth": "1970-01-01",
    "amount": 2500000,
    "benefitType": "LS",
    "mode": "M",
    "riders": ["child", "chronic"]
  }'
  ```

#### **Select Quote** (`POST /select-quote`)
- **Example Request**:
  ```bash
  curl -X POST <api-url>/select-quote -H "Content-Type: application/json" -d '{
    "coveragePeriod": "term10",
    "rateClass": "preferredPlus",
    "selectedPremium": 4474
  }'
  ```

Replace `<api-url>` with the API URL provided after deployment.

---

### 6. Clean Up
To remove the deployed resources from AWS, run the following command:

```bash
npm run remove
```

This will delete all the resources created during deployment, including the API, database, and Lambda functions.

---
