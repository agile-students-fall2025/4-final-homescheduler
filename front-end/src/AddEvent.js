import React from 'react';

export function EventButton() {
  // 1. Define the function to run on click
  const handleAddEvent = () => {
    console.log('Add Event button clicked!');
    // Later, this function will do more than just log.
  };

  return (
    <div ClassName = "EventButton" >
      {/* 2. Attach the function to the button's onClick prop */}
      < button onClick={handleAddEvent}>
        Add Event
      </button>
    </div>
  );
}

  