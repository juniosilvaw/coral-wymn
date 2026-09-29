import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface HymnAudioPlayerProps {
  hymnTitle: string;
  audioUrl?: string;
  vocalParts?: {
    soprano?: string;
    contralto?: string;
    tenor?: string;
    baixo?: string;
  };
}

export function HymnAudioPlayer({ hymnTitle, audioUrl, vocalParts }: HymnAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<string>("full");
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentAudioUrl = selectedVoice === "full" ? audioUrl : vocalParts?.[selectedVoice as keyof typeof vocalParts];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && currentAudioUrl) {
      audioRef.current.src = currentAudioUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentAudioUrl, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentAudioUrl) {
    return (
      <div className="p-4 bg-card/50 rounded-lg border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          Áudio não disponível para este hino
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg border border-border/50">
      <audio ref={audioRef} />

      {/* Player Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          className="h-10 w-10"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        {/* Time Display */}
        <div className="text-xs text-muted-foreground font-mono">
          {formatTime(currentTime)}
        </div>

        {/* Progress Bar */}
        <Slider
          value={[currentTime]}
          max={duration || 0}
          step={0.1}
          onValueChange={handleTimeChange}
          className="flex-1"
        />

        {/* Duration Display */}
        <div className="text-xs text-muted-foreground font-mono">
          {formatTime(duration)}
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        {volume === 0 ? (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        )}
        <Slider
          value={[volume]}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
        <span className="text-xs text-muted-foreground w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Vocal Parts Selection */}
      {vocalParts && Object.keys(vocalParts).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground/70">Naipe Vocal</p>
          <ToggleGroup
            type="single"
            value={selectedVoice}
            onValueChange={(value) => value && setSelectedVoice(value)}
            className="justify-start"
          >
            <ToggleGroupItem value="full" aria-label="Completo">
              Completo
            </ToggleGroupItem>
            {vocalParts.soprano && (
              <ToggleGroupItem value="soprano" aria-label="Soprano">
                Soprano
              </ToggleGroupItem>
            )}
            {vocalParts.contralto && (
              <ToggleGroupItem value="contralto" aria-label="Contralto">
                Contralto
              </ToggleGroupItem>
            )}
            {vocalParts.tenor && (
              <ToggleGroupItem value="tenor" aria-label="Tenor">
                Tenor
              </ToggleGroupItem>
            )}
            {vocalParts.baixo && (
              <ToggleGroupItem value="baixo" aria-label="Baixo">
                Baixo
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </div>
      )}
    </div>
  );
}
