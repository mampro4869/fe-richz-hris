import toast from 'react-hot-toast';

// Standardized alert types
export type AlertType = 'success' | 'error' | 'warning' | 'info';

// Alert configuration
const alertConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '8px',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid var(--border-primary)',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '400px',
  },
};

// Success alerts
export const showSuccess = (message: string, options?: any) => {
  return toast.success(message, {
    ...alertConfig,
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: '4px solid #10b981',
      ...options?.style,
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  });
};

// Error alerts
export const showError = (message: string, options?: any) => {
  return toast.error(message, {
    ...alertConfig,
    duration: 6000, // Longer duration for errors
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: '4px solid #ef4444',
      ...options?.style,
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  });
};

// Warning alerts
export const showWarning = (message: string, options?: any) => {
  return toast(message, {
    ...alertConfig,
    duration: 5000,
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: '4px solid #f59e0b',
      ...options?.style,
    },
    icon: '⚠️',
  });
};

// Info alerts
export const showInfo = (message: string, options?: any) => {
  return toast(message, {
    ...alertConfig,
    ...options,
    style: {
      ...alertConfig.style,
      borderLeft: '4px solid #3b82f6',
      ...options?.style,
    },
    icon: 'ℹ️',
  });
};

// Confirmation dialog with promise-based response
export const showConfirm = (message: string, options?: any): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmToast = toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <p className="text-primary dark:text-dark-100 font-medium">{message}</p>
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 text-sm border border-primary dark:border-dark-600 bg-primary dark:bg-dark-700 text-primary dark:text-dark-200 rounded hover:bg-tertiary dark:hover:bg-dark-600 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          ...alertConfig.style,
          borderLeft: '4px solid #3b82f6',
          padding: '16px',
        },
        ...options,
      }
    );
  });
};

// Loading alert with promise
export const showLoading = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: any
) => {
  return toast.promise(promise, messages, {
    ...alertConfig,
    ...options,
    style: {
      ...alertConfig.style,
      ...options?.style,
    },
    success: {
      style: {
        ...alertConfig.style,
        borderLeft: '4px solid #10b981',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      style: {
        ...alertConfig.style,
        borderLeft: '4px solid #ef4444',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
    loading: {
      style: {
        ...alertConfig.style,
        borderLeft: '4px solid #6b7280',
      },
    },
  });
};

// Dismiss all alerts
export const dismissAll = () => {
  toast.dismiss();
};

// Dismiss specific alert
export const dismiss = (toastId: string) => {
  toast.dismiss(toastId);
};