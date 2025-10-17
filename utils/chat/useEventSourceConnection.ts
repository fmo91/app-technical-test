import { useCallback, useEffect, useRef } from 'react';
import EventSource from 'react-native-sse';

type UseEventSourceConnectionParams = {
  url: string;
  enabled: boolean;
  eventNames: readonly string[];
  onEvent: (event: MessageEvent<string>) => void;
};

export function useEventSourceConnection({
  url,
  enabled,
  eventNames,
  onEvent,
}: UseEventSourceConnectionParams) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const handleEventRef = useRef<((event: MessageEvent<string>) => void) | null>(null);

  const tearDown = useCallback(() => {
    const eventSource = eventSourceRef.current;
    const handleEvent = handleEventRef.current;

    if (eventSource && handleEvent) {
      eventNames.forEach((eventName) =>
        eventSource.removeEventListener(eventName as any, handleEvent),
      );
    }

    if (eventSource) {
      eventSource.close();
    }

    eventSourceRef.current = null;
    handleEventRef.current = null;
  }, [eventNames]);

  useEffect(() => {
    if (!enabled) {
      tearDown();
      return;
    }

    if (eventSourceRef.current) {
      // Already streaming for this configuration.
      return;
    }

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    const handleEvent = (event: MessageEvent<string>) => {
      onEvent(event);
    };

    handleEventRef.current = handleEvent;

    eventNames.forEach((eventName) =>
      eventSource.addEventListener(eventName as any, handleEvent),
    );

    return () => {
      if (eventSourceRef.current === eventSource) {
        tearDown();
      } else {
        eventNames.forEach((eventName) =>
          eventSource.removeEventListener(eventName as any, handleEvent),
        );
        eventSource.close();
      }
    };
  }, [enabled, eventNames, onEvent, tearDown, url]);

  useEffect(() => {
    return () => {
      tearDown();
    };
  }, [tearDown]);

  return { tearDown };
}
