"use client";

/**
 * CyberAudioSystem - Completely muted / disabled per user request.
 * All sound effects have been removed from the entire website.
 */
class CyberAudioSystem {
  public enabled: boolean = false;

  playHover() {
    // Sound disabled
  }

  playClick() {
    // Sound disabled
  }

  playSuccess() {
    // Sound disabled
  }

  playTerminalKey() {
    // Sound disabled
  }
}

export const cyberAudio = new CyberAudioSystem();
