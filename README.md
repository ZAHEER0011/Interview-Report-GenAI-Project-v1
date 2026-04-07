# GenAI Interview Report Generator

[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5--flash-red)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A cutting-edge, AI-powered platform that revolutionizes interview preparation by generating personalized, data-driven interview strategies using advanced machine learning and natural language processing.

## 🚀 Features

### AI-Powered Analysis
- **Intelligent Report Generation**: Leverages Google Gemini 2.5-flash AI model for comprehensive interview analysis
- **Resume Parsing**: Advanced PDF text extraction using Apache Tika
- **Personalized Insights**: Tailored technical and behavioral questions based on job requirements and candidate profile
- **Skill Gap Analysis**: Automated identification of knowledge gaps with severity ratings
- **7-10 Days Preparation Roadmap**: Structured learning plan with daily actionable tasks

### Enterprise-Grade Architecture
- **Microservices Design**: Scalable backend with RESTful APIs
- **JWT Authentication**: Secure token-based authentication with blacklist management
- **Role-Based Access**: User-specific data isolation and security
- **Database Persistence**: JPA/Hibernate with optimized queries
- **File Upload Handling**: Robust multipart file processing with validation

### Modern Frontend Experience
- **Responsive UI**: Mobile-first design with SCSS styling
- **Real-time Feedback**: Dynamic file upload status and progress indicators
- **Interactive Reports**: Collapsible sections with smooth animations
- **Navigation Controls**: Intuitive routing with protected routes
- **Error Handling**: Comprehensive error boundaries and user feedback

### Security & Performance
- **Data Encryption**: Secure API communication with HTTPS
- **Input Validation**: Server-side validation with Spring Boot Validation
- **Rate Limiting**: Built-in protection against abuse
- **Optimized Queries**: Efficient database operations with indexing

## 🏗️ Architecture

### Backend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Repositories  │
│                 │    │                 │    │                 │
│ • AIController  │◄──►│ • AIService     │◄──►│ • InterviewRepo │
│ • AuthController│    │ • AuthService   │    │ • UserRepo      │
│ • Security      │    │ • JWT Util      │    │ • BlacklistRepo │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Google Gemini  │
                    │   AI Model      │
                    └─────────────────┘
```

### Frontend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │     Hooks       │    │    Services     │
│                 │    │                 │    │                 │
│ • Home          │◄──►│ • useInterview  │◄──►│ • interview.api │
│ • Interview     │    │ • useAuth       │    │ • auth.api      │
│ • AllReports    │    │ • Context       │    │ • Axios Config  │
│ • Auth Forms    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.0+ with Spring Security
- **Language**: Java 17
- **Database**: H2/MySQL with JPA/Hibernate
- **AI Integration**: Google Gemini 2.5-flash API
- **File Processing**: Apache Tika for PDF parsing
- **Authentication**: JWT with token blacklisting
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19 with Hooks
- **Build Tool**: Vite for fast development
- **Routing**: React Router v7
- **Styling**: SCSS with custom design system
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Icons**: Lucide React

### DevOps & Tools
- **Version Control**: Git
- **Package Management**: npm (Frontend), Maven (Backend)
- **Code Quality**: ESLint, Prettier
- **Testing**: JUnit (Backend), Jest (Frontend)
- **Containerization**: Docker & Docker Compose
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- **Java**: JDK 17 or higher (for local development)
- **Node.js**: v18+ with npm (for local development)
- **Maven**: 3.6+ (for local development)
- **Docker**: 20.10+ and Docker Compose 2.0+ (for containerized deployment)
- **Google AI API Key**: For Gemini integration

## 🚀 Installation & Setup

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/genai-interview-generator.git
   cd genai-interview-generator
   ```

2. **Configure environment variables**
   ```bash
   # Copy and edit the environment file
   cp .env.example .env

   # Add your Google Gemini API key
   # GOOGLE_API_KEY=your_actual_api_key_here
   ```

3. **Build and run with Docker Compose**
   ```bash
   # For development
   docker-compose up --build

   # For production
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   ```

4. **Access the application**
   - Backend API: http://localhost:8080
   - Database: localhost:3306 (if needed for debugging)

### Option 2: Local Development Setup

#### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/interview-report-genai-project.git
   cd genai-interview-generator/backend
   ```

2. **Configure environment**
   ```bash
   # Create application.properties
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   
   # Edit application.properties with your database and API settings
   # google.api.key=your_google_gemini_api_key_here
   # spring.datasource.url=jdbc:h2:mem:testdb
   ```

3. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   Server starts on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with backend URL
   # VITE_BASE_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## � Docker Deployment

### Quick Docker Commands

```bash
# Development environment
docker-compose up --build

# Production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build --force-recreate
```

### Environment Configuration

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=genai_db
MYSQL_USER=genai_user
MYSQL_PASSWORD=genai_password
JWT_SECRET=your_jwt_secret_here
```

For detailed Docker setup instructions, see [DOCKER_README.md](DOCKER_README.md).

## �📖 Usage

### User Workflow

1. **Registration/Login**: Create account or sign in
2. **Upload Resume**: PDF format with professional experience
3. **Job Description**: Paste target job requirements
4. **Self Description**: Add personal career context
5. **Generate Report**: AI analyzes and creates personalized strategy
6. **View Results**: Interactive report with questions, roadmap, and insights
7. **Track Progress**: Access all generated reports in dashboard

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Token blacklisting
- `GET /api/auth/user/get-me` - Get current user

#### Interview Reports
- `POST /api/interview/report` - Generate new report
- `GET /api/interview/report/{id}` - Get specific report
- `GET /api/interview/reports` - Get user's reports

## 🤖 AI Implementation

The platform integrates Google Gemini 2.5-flash for intelligent analysis:

### Report Generation Process
1. **Input Processing**: Parse resume PDF and extract text content
2. **Prompt Engineering**: Construct detailed prompts with job requirements
3. **AI Analysis**: Generate comprehensive interview strategy
4. **Response Parsing**: Validate and structure JSON response
5. **Data Persistence**: Store report with user association

### AI Capabilities
- **Technical Question Generation**: Role-specific coding and system design questions
- **Behavioral Assessment**: Leadership and problem-solving scenarios
- **Skill Gap Detection**: Automated competency analysis
- **Preparation Planning**: Structured 7-day learning roadmap

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based security
- **Password Hashing**: Secure credential storage
- **CORS Configuration**: Controlled cross-origin access
- **Input Sanitization**: Protection against injection attacks
- **Rate Limiting**: API abuse prevention
- **Token Blacklisting**: Secure logout mechanism

## 📊 Performance Metrics

- **Response Time**: < 30 seconds for report generation
- **Concurrent Users**: Supports 100+ simultaneous sessions
- **File Processing**: Handles PDFs up to 5MB efficiently
- **Database Queries**: Optimized with indexing and caching

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Java/Spring Boot best practices
- Use React functional components with hooks
- Maintain SCSS naming conventions
- Write comprehensive tests
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI**: For providing powerful Gemini models
- **Spring Boot**: Robust backend framework
- **React Community**: Innovative frontend ecosystem
- **Open Source Contributors**: Libraries and tools used

## 📞 Contact

For questions or support:
- **Email**: your-email@example.com
- **GitHub Issues**: [Create an issue](https://github.com/your-username/genai-interview-generator/issues)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

---

**Built with ❤️ using cutting-edge AI and modern web technologies**