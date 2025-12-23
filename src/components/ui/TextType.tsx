'use client'

import type { animate as AnimateType } from 'animejs'
import { animate } from 'animejs'
import {
  createElement,
  type ElementType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface TextTypeProps {
  className?: string
  showCursor?: boolean
  hideCursorWhileTyping?: boolean
  cursorCharacter?: string | React.ReactNode
  cursorBlinkDuration?: number
  cursorClassName?: string
  text: string | string[]
  as?: ElementType
  typingSpeed?: number
  initialDelay?: number
  pauseDuration?: number
  deletingSpeed?: number
  loop?: boolean
  textColors?: string[]
  variableSpeed?: { min: number; max: number }
  onSentenceComplete?: (sentence: string, index: number) => void
  startOnVisible?: boolean
  reverseMode?: boolean
}

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnVisible)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const cursorAnimationRef = useRef<ReturnType<typeof AnimateType> | null>(null)

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed
    const { min, max } = variableSpeed
    return Math.random() * (max - min) + min
  }, [variableSpeed, typingSpeed])

  const getCurrentTextColor = useCallback(() => {
    if (textColors.length === 0) return
    return textColors[currentTextIndex % textColors.length]
  }, [textColors, currentTextIndex])

  // IntersectionObserver for startOnVisible
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [startOnVisible])

  // Cursor blink animation using Anime.js v4
  useEffect(() => {
    if (!showCursor || !cursorRef.current) return

    // Kill previous animation
    if (cursorAnimationRef.current) {
      cursorAnimationRef.current.pause()
    }

    // Create new blink animation following v4 API
    cursorAnimationRef.current = animate(cursorRef.current, {
      opacity: { to: 0 },
      duration: cursorBlinkDuration * 1000,
      ease: 'inOutQuad',
      alternate: true,
      loop: true,
    })

    return () => {
      if (cursorAnimationRef.current) {
        cursorAnimationRef.current.pause()
      }
    }
  }, [showCursor, cursorBlinkDuration])

  // Typing animation logic
  useEffect(() => {
    if (!isVisible) return

    let timeout: NodeJS.Timeout

    const currentText = textArray[currentTextIndex]
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false)
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex)
          }

          setCurrentTextIndex((prev) => (prev + 1) % textArray.length)
          setCurrentCharIndex(0)
          timeout = setTimeout(() => {}, pauseDuration)
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1))
          }, deletingSpeed)
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText((prev) => prev + processedText[currentCharIndex])
              setCurrentCharIndex((prev) => prev + 1)
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          )
        } else if (textArray.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, pauseDuration)
        }
      }
    }

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay)
    } else {
      executeTypingAnimation()
    }

    return () => clearTimeout(timeout)
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    getRandomSpeed,
  ])

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Dependencies are intentionally managed for performance
  const memoizedElement = useMemo(() => {
    const textColor = getCurrentTextColor()
    return createElement(
      Component,
      {
        ref: containerRef,
        className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
        ...props,
      },
      <span className="inline" style={{ color: textColor || 'inherit' }}>
        {displayedText}
      </span>,
      showCursor && (
        <span
          ref={cursorRef}
          className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
        >
          {cursorCharacter}
        </span>
      )
    )
  }, [
    Component,
    className,
    displayedText,
    showCursor,
    shouldHideCursor,
    cursorClassName,
    cursorCharacter,
    textColors,
    currentTextIndex,
  ])

  return memoizedElement
}

export default TextType
