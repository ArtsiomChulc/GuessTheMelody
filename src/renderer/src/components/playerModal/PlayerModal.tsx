import { JSX, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Eye, EyeOff, Music, Pause, Play, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Song, Team } from '@renderer/types/types'
import GONG_URL from '../../assets/gong-1.mp3'

// --- Styled Components ---

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);
`

const ModalCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 48rem;
  padding: 3rem;
  background: linear-gradient(to bottom right, #2a0a2a, #1a051a);
  border: 4px solid #ca8a04;
  border-radius: 1.5rem;
  box-shadow: 0 0 50px rgba(202, 138, 4, 0.3);
  text-align: center;
`

const VinylRecord = styled(motion.div)<{ $isPlaying: boolean }>`
  width: 10rem;
  height: 10rem;
  margin: 0 auto 2rem;
  border-radius: 9999px;
  border: 8px solid rgba(202, 138, 4, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
`

const ProgressTrack = styled.div`
  width: 16rem;
  height: 0.25rem;
  background-color: rgba(202, 138, 4, 0.2);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
`

const ProgressBar = styled(motion.div)`
  height: 100%;
  background-color: #ca8a04;
`

const TeamButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ca8a04;
  color: black;
  font-weight: 900;
  border-radius: 0.5rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background-color: #eab308;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`

const ControlButton = styled.button`
  width: 4rem;
  height: 4rem;
  background-color: #ca8a04;
  color: black;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #eab308;
  }
`

interface Props {
  song: Song
  teams: Team[]
  onAwardPoints: (teamId: string) => void
  onClose: () => void
}

export const PlayerModal = ({ song, teams, onAwardPoints, onClose }: Props): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  const [timeLeft, setTimeLeft] = useState(20)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      audioRef.current?.pause()
      setIsPlaying(false)
    }

    return () => clearInterval(interval)
  }, [isPlaying, timeLeft, showAnswer])

  useEffect(() => {
    if (!song.path) return

    setTimerKey((prev) => prev + 1)
    setTimeLeft(20)

    const normalizedPath = song.path.replace(/\\/g, '/')
    const audioUrl = `file:///${normalizedPath}`

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const playAudio = async (): Promise<void> => {
      try {
        await audio.load()
        await audio.play()
        setIsPlaying(true)
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Playback Error:', err)
      }
    }

    playAudio()

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [song.path])

  const handleShowAnswer = (): void => {
    if (!showAnswer) {
      const gong = new Audio(GONG_URL)
      gong.volume = 0.4
      gong.play().catch(() => {})

      audioRef.current?.pause()
      setIsPlaying(false)
    }
    setShowAnswer(!showAnswer)
  }

  const togglePlay = (): void => {
    if (isPlaying) audioRef.current?.pause()
    else {
      if (timeLeft === 0) setTimeLeft(20)
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <AnimatePresence>
      <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalCard>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#ca8a04' }}
          >
            <X size={40} />
          </button>

          <p
            style={{
              color: '#ca8a04',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem'
            }}
          >
            Мелодия за
          </p>
          <h2
            style={{
              fontSize: '3.75rem',
              fontWeight: 900,
              color: 'white',
              marginBottom: '2rem',
              fontStyle: 'italic'
            }}
          >
            {song.points} ОЧКОВ
          </h2>

          <VinylRecord
            $isPlaying={isPlaying}
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Music size={50} color={isPlaying ? '#ca8a04' : '#374151'} />
          </VinylRecord>

          <div
            style={{
              marginBottom: '2.5rem',
              minHeight: '10rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              padding: '1.5rem 0'
            }}
          >
            {showAnswer ? (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ width: '100%' }}
              >
                <p
                  style={{
                    color: '#ca8a04',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    marginBottom: '0.25rem'
                  }}
                >
                  Верный ответ:
                </p>
                <h3
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {song.title}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {teams.map((team) => (
                    <TeamButton key={team.id} onClick={() => onAwardPoints(team.id)}>
                      + {team.name}
                    </TeamButton>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: timeLeft <= 5 ? '#ef4444' : '#ca8a04',
                    transition: 'color 0.3s'
                  }}
                >
                  {timeLeft}
                </div>
                <ProgressTrack>
                  <ProgressBar
                    key={timerKey}
                    initial={{ width: 0 }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: 20, ease: 'linear' }}
                  />
                </ProgressTrack>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <ControlButton onClick={togglePlay}>
              {isPlaying ? (
                <Pause size={30} fill="currentColor" />
              ) : (
                <Play size={30} fill="currentColor" style={{ marginLeft: '4px' }} />
              )}
            </ControlButton>

            <button
              onClick={handleShowAnswer}
              style={{
                padding: '0 2rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {showAnswer ? <EyeOff size={20} /> : <Eye size={20} />}
              {showAnswer ? 'Скрыть' : 'Ответ'}
            </button>
          </div>
        </ModalCard>
      </Overlay>
    </AnimatePresence>
  )
}
