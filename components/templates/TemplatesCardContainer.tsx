'use client';
import TemplatesCards from './TemplatesCards';

interface Template {
  id: string;
  name: string;
  displayMode: string;
  updatedAt: string;
}

const TemplatesCardContainer = ({ templates }) => {
  return (
    <section>
      Template card Container
      {templates &&
        templates.map(({ id, name, displayMode, updatedAt }) => (
          <TemplatesCards
            key={id}
            name={name}
            displayMode={displayMode}
            id={id}
            updatedAt={updatedAt}
          />
        ))}
    </section>
  );
};

export default TemplatesCardContainer;
