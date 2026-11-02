import { useEffect, useCallback } from 'react';

export const AGENT_CRUD_EVENT = 'craftroots:agent_crud';

/**
 * Phát sự kiện khi AI Agent thực thi thành công một thao tác CRUD
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
  console.log('[LiveAgentSync] Phát sự kiện CRUD từ AI Agent:', action.tool, action.data);
}

/**
 * Custom React Hook để các trang lắng nghe và tự động cập nhật State trực tiếp
 * @param {Function} callback - Hàm xử lý khi có hành động CRUD ({ tool, data, arguments, message })
 * @param {Array} deps - Dependency array cho callback
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
