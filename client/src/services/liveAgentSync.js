import { useEffect, useCallback } from 'react';

export const AGENT_CRUD_EVENT = 'craftroots:agent_crud';

/**
 * Dispatch event when AI Agent successfully executes a CRUD action
 * @param {Object} action - { tool, data, arguments, message }
 */
export function emitAgentCrudAction(action) {
  if (typeof window === 'undefined') return;

  const event = new CustomEvent(AGENT_CRUD_EVENT, {
    detail: {
      ...action,
      timestamp: Date.now()
    }
  });

  window.dispatchEvent(event);
  console.log('[LiveAgentSync] Broadcast CRUD action from AI Agent:', action.tool, action.data);
}

/**
 * Custom React Hook for components to listen and automatically update state
 * @param {Function} callback - Handler when CRUD action arrives ({ tool, data, arguments, message })
 * @param {Array} deps - Dependency array for callback
 */
export function useAgentLiveSync(callback, deps = []) {
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (event) => {
      if (event && event.detail) {
        memoizedCallback(event.detail);
      }
    };

    window.addEventListener(AGENT_CRUD_EVENT, handler);
    return () => {
      window.removeEventListener(AGENT_CRUD_EVENT, handler);
    };
  }, [memoizedCallback]);
}

export default {
  AGENT_CRUD_EVENT,
  emitAgentCrudAction,
  useAgentLiveSync
};
