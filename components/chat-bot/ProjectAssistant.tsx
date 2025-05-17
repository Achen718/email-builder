'use client';
import { AIChatComponent } from 'ai-project-assistant';

export function ProjectAssistant() {
  return (
    <div style={{ height: '500px', width: '100%', maxWidth: '800px' }}>
      <AIChatComponent
        apiKey='your-api-key'
        apiEndpoint='http://localhost:3000/api/assistant'
        placeholder='Ask me anything...'
      />
    </div>
  );
}
