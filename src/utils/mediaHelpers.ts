// Safe MediaSession and Picture-in-Picture helpers

// Register only valid MediaSession actions
export function setupMediaSession(handlers: Record<string, () => void> = {}) {
  if (!('mediaSession' in navigator)) return;
  
  const validActions = [
    'play', 'pause', 'seekbackward', 'seekforward', 'seekto',
    'previoustrack', 'nexttrack', 'stop', 'skipad'
  ];
  
  for (const action of validActions) {
    try {
      navigator.mediaSession.setActionHandler(action as any, handlers[action] || null);
    } catch {
      // Ignore if the browser doesn't support this action
    }
  }
}

// Real Picture-in-Picture uses the <video> API (not MediaSession)
export async function enterPictureInPicture(videoElement: HTMLVideoElement) {
  try {
    if (!videoElement || !document.pictureInPictureEnabled) return;
    if (document.pictureInPictureElement) return;
    await videoElement.requestPictureInPicture();
  } catch {
    // No-op if PiP fails
  }
}

// Exit Picture-in-Picture
export async function exitPictureInPicture() {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
  } catch {
    // No-op if exit fails
  }
}