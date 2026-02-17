'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/store/useAppStore';
import { findFirstArray, getValueAtPath } from '@/lib/utils';

export function UploadPanel() {
  const setItems = useAppStore((state) => state.setItems);
  const setUploadState = useAppStore((state) => state.setUploadState);
  const setSelectedJsonPath = useAppStore((state) => state.setSelectedJsonPath);
  const upload = useAppStore((state) => state.upload);
  const validateAllImages = useAppStore((state) => state.validateAllImages);

  const [detectedPaths, setDetectedPaths] = useState<string[]>([]);
  const [customPath, setCustomPath] = useState('');
  const [showPathSelector, setShowPathSelector] = useState(false);
  const [rawJson, setRawJson] = useState<unknown>(null);

  const processJson = useCallback((json: unknown) => {
    let array: unknown[] | null = null;

    if (Array.isArray(json)) {
      array = json;
    } else if (typeof json === 'object' && json !== null) {
      // Find all array paths
      const paths: string[] = [];
      const findArrays = (obj: unknown, path = '') => {
        if (Array.isArray(obj)) {
          paths.push(path || 'root');
        } else if (obj !== null && typeof obj === 'object') {
          Object.entries(obj).forEach(([key, value]) => {
            findArrays(value, path ? `${path}.${key}` : key);
          });
        }
      };
      findArrays(json);

      if (paths.length === 1) {
        array = getValueAtPath(json, paths[0]) as unknown[];
        setSelectedJsonPath(paths[0]);
      } else if (paths.length > 1) {
        setDetectedPaths(paths);
        setShowPathSelector(true);
        setRawJson(json);
        setUploadState({ status: 'loading', detectedPath: paths[0] });
        return;
      } else {
        array = findFirstArray(json);
      }
    }

    if (array) {
      const items = array
        .filter((item) => item !== null && typeof item === 'object')
        .map((data, index) => ({
          data: data as Record<string, unknown>,
          originalIndex: index,
        }));

      const processedItems = items.map(({ data, originalIndex }) => {
        const id = `${originalIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const imageCandidates: string[] = [];
        
        // Extract image URLs
        const extractUrls = (obj: unknown): void => {
          if (typeof obj === 'string') {
            if (/^https?:\/\//i.test(obj) && obj.length < 200) {
              imageCandidates.push(obj);
            }
          } else if (Array.isArray(obj)) {
            obj.forEach(extractUrls);
          } else if (obj !== null && typeof obj === 'object') {
            Object.values(obj).forEach(extractUrls);
          }
        };
        extractUrls(data);

        const totalImages = [...new Set(imageCandidates)].length;
        const status: 'all_valid' | 'no_images' = totalImages > 0 ? 'all_valid' : 'no_images';

        return {
          id,
          originalIndex,
          data,
          imageCandidates: [...new Set(imageCandidates)],
          imageStatuses: new Map<string, 'loading' | 'valid' | 'broken' | 'timeout'>(),
          totalImages,
          validCount: 0,
          brokenCount: 0,
          status,
          isSelected: false,
        };
      });

      setItems(processedItems);
      setUploadState({ status: 'success' });
      validateAllImages();
    } else {
      setUploadState({ status: 'error', error: 'No array found in JSON' });
    }
  }, [setItems, setUploadState, setSelectedJsonPath, validateAllImages]);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.json')) {
      setUploadState({ status: 'error', error: 'Please upload a .json file' });
      return;
    }

    setUploadState({ status: 'loading' });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        processJson(json);
      } catch {
        setUploadState({ status: 'error', error: 'Invalid JSON file' });
      }
    };
    reader.onerror = () => {
      setUploadState({ status: 'error', error: 'Failed to read file' });
    };
    reader.readAsText(file);
  }, [processJson, setUploadState]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const handlePathSelect = (path: string) => {
    if (rawJson) {
      setSelectedJsonPath(path);
      processJson(rawJson);
      setShowPathSelector(false);
      setRawJson(null);
      setDetectedPaths([]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive
            ? 'border-teal-500 bg-teal-50'
            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-gray-600">
            {isDragActive ? (
              <p>Drop the JSON file here...</p>
            ) : (
              <>
                <p className="font-medium">
                  Drag & drop a JSON file here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports .json files only
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {upload.status === 'loading' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Processing JSON file...</p>
        </div>
      )}

      {upload.status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{upload.error}</p>
        </div>
      )}

      {upload.status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">JSON loaded successfully!</p>
        </div>
      )}

      {showPathSelector && detectedPaths.length > 0 && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">
            Multiple arrays detected. Select which one to use:
          </h3>
          <div className="space-y-2">
            {detectedPaths.map((path) => (
              <button
                key={path}
                onClick={() => handlePathSelect(path)}
                className="w-full text-left px-4 py-2 rounded-md bg-gray-50 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                <code className="text-sm">{path}</code>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">
              Or enter custom path:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="e.g., data.items"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => handlePathSelect(customPath)}
                disabled={!customPath}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
