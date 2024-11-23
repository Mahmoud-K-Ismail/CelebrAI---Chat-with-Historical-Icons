# CelebChat

## Overview

PersonaGPT is a web application that allows users to engage in conversations in the style of various famous personalities, not just William Shakespeare. Users can input text, and the application will generate responses mimicking the unique writing style of the chosen persona. This project aims to provide an entertaining and educational experience for literature enthusiasts, students, and anyone interested in exploring the language and styles of different historical and cultural figures.

The application uses Gemini API to generate responses.

## Data Model

The application will store Users, Conversations, and Messages:

- **Users** can have multiple conversations (via references).
- Each **conversation** can have multiple messages (by embedding).

### Example User
```javascript
{
  username: "bardlover123",
  hash: // a password hash,
  conversations: // an array of references to Conversation documents
}
```

### Example Conversation with Embedded Messages
```javascript
{
  user: // a reference to a User object,
  character: "Hamlet",
  messages: [
    { 
      content: "To be, or not to be, that is the question:",
      isUser: false,
      timestamp: // timestamp
    },
    {
      content: "What's troubling you, good Hamlet?",
      isUser: true,
      timestamp: // timestamp
    }
  ],
  createdAt: // timestamp
}
```

## [Link to Commented First Draft Schema](db.js)

## Wireframes

- **/login** - Page for logging in or registering  
  ![Wireframe for Login Page](register.png)

- **/chat** - Main page for chatting with Shakespeare  
  ![Wireframe for Chat Page](chat.png)

- **/user info editing** - Page for editing user info
  ![Wireframe for Change Username](change.png)

## Site Map
![Site Map](map.png)
Site map

## User Stories or Use Cases

1. As a non-registered user, I can register a new account with the site.
2. As a user, I can log in to the site.
3. As a user, I can start a new conversation with a Shakespearean character.
4. As a user, I can view my conversation history.
5. As a user, I can continue a previous conversation.
6. As a user, I can choose different Shakespearean characters to converse with.

## Research Topics

### 1. User Authentication - 5 points
- **What is it?** Authentication is the process of confirming the identity of a user who tries to access an application, typically by verifying credentials such as a username and password.
- **Why use it?** Ensures that only authenticated users can access sensitive data, like conversation history, protecting user privacy and application security.
- **Modules/Solutions:**
  - Passport.js (offers modular, flexible authentication strategies for Node.js)
  - JWT (stateless, token-based authentication)
  - OAuth 2.0 (for integration with providers like Google)
- **Points:** 5 points

### 2. CSS Framework for Consistent Styling - 3 points
- **What is it?** A CSS framework provides reusable, pre-defined styles and layout structures to create a visually cohesive, responsive UI.
- **Why use it?** Streamlines the design process and enhances the user experience by creating a consistent, polished appearance across all pages.
- **Modules/Solutions:**
  - Tailwind CSS (utility-first, highly customizable)
  - Bootstrap (widely used, feature-rich)
  - Bulma (lightweight and flexible)
- **Points:** 3 points

### 3. Client-Side Form Validation - 4 points
- **What is it?** Form validation checks that input data conforms to expected formats before submission, such as required fields or valid email addresses.
- **Why use it?** Improves user experience by providing immediate feedback, reducing server load by filtering invalid submissions at the client level.
- **Modules/Solutions:**
  - JavaScript (custom validation)
  - Parsley.js (flexible form validation library)
  - Validator.js (utility for common validation patterns)
- **Points:** 4 points

### 4. Machine Learning Integration for Shakespearean Text Generation - 5 points
- **What is it?** Integrates a pre-trained language model to generate responses in the Shakespearean style, adding authenticity and engagement to user conversations.
- **Why use it?** Enhances the experience by creating high-quality, thematic responses that mimic Shakespeare's language, making the application unique.
- **Modules/Solutions:**
  - Hugging Face Transformers (extensive support for pre-trained NLP models)
  - OpenAI GPT-2 (popular language model for fine-tuning)
  - spaCy (for various NLP tasks and model deployment)
- **Points:** 5 points

**Total Points:** 17 out of 10 required points

## [Link to Initial Main Project File](app.mjs)

## Annotations / References Used

1. [Passport.js Authentication Docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [Tailwind CSS Documentation](https://tailwindcss.com/docs) - (add link to source code that was based on this)
3. [HuggingFace Transformers Library](https://huggingface.co/transformers/) - (add link to source code that was based on this)
4. [Express.js Documentation](https://expressjs.com/) - (add link to source code that was based on this)
