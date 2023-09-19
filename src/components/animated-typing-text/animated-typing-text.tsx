import React, {FC, useEffect, useRef, useState} from 'react';
import {Text, TextProps} from 'react-native';

type AnimatedTypingTextProps = {
  text: string;
  ms?: number;
  onRenderComplete?: () => void;
  onRenderFinal?: () => void;
} & TextProps;

const useTypingAnimation = (
  text: string,
  ms: number,
  onRenderComplete?: () => void,
  onRenderFinal?: () => void,
) => {
  const [renderText, setRenderText] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const addNextCharacterTimeout = useRef<NodeJS.Timeout | null>(null);
  const removeCharacterTimeout = useRef<NodeJS.Timeout | null>(null);

  const startCharacterRemoval = () => {
    let currentIndex = renderText.length - 1;

    const removeCharacter = () => {
      if (currentIndex >= 0) {
        setRenderText(prevText => prevText.slice(0, -1));
        currentIndex--;
        removeCharacterTimeout.current = setTimeout(removeCharacter, 1);
      } else {
        onRenderFinal?.();
      }
    };

    removeCharacter();
  };

  useEffect(() => {
    if (isComplete) {
      setIsComplete(false);
      onRenderComplete?.();
      startCharacterRemoval();
    }
  }, [isComplete, onRenderComplete]);

  useEffect(() => {
    let currentIndex = 0;

    const addNextCharacter = () => {
      if (currentIndex < text.length) {
        setRenderText(prevText => prevText + text.charAt(currentIndex));
        currentIndex++;
        addNextCharacterTimeout.current = setTimeout(addNextCharacter, ms);
      } else {
        setIsComplete(true);
      }
    };

    addNextCharacter();

    return () => {
      if (addNextCharacterTimeout.current) {
        clearTimeout(addNextCharacterTimeout.current);
      }
      if (removeCharacterTimeout.current) {
        clearTimeout(removeCharacterTimeout.current);
      }
    };
  }, [text, ms]);

  return renderText;
};

const AnimatedTypingText: FC<AnimatedTypingTextProps> = ({
  text,
  ms = 50,
  onRenderComplete,
  onRenderFinal,
  ...restProps
}) => {
  const renderText = useTypingAnimation(
    text,
    ms,
    onRenderComplete,
    onRenderFinal,
  );

  return (
    <Text {...restProps}>
      {renderText}
      {renderText.length === text.length ? '' : '|'}
    </Text>
  );
};

export default AnimatedTypingText;
