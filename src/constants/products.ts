export const STATUS_PROGRESS_MAP: any = {
  ProcessingQueue: {
    progress: 10,
    color: 'red',
    msg: 'Preview generation process is in Queue',
    label: 'Queued'
  },
  ProcessingPending: {
    progress: 30,
    color: 'yellow',
    msg: 'Preview generation process is pending',
    label: 'Pending'
  },
  ProcessingProcessing: {
    progress: 50,
    color: 'lime',
    msg: 'Preview generation process is processing',
    label: 'Processing'
  },
  ProcessingSuccess: {
    progress: 100,
    color: 'green',
    msg: 'Preview generation process is finished',
    label: 'Success'
  }
};

export const INPUT_OPTIONS: {
  label: string;
  value: string;
  fileTypes?: string;
  placeholder: string;
}[] = [
  {
    label: 'Blender python script as text input',
    value: 'blenderPyInput',
    placeholder: 'Enter or paste your python script here'
  },
  {
    label: 'Blender python script as a python file',
    value: 'blenderPyFile',
    fileTypes: 'py',
    placeholder: 'Upload the python script file'
  },
  {
    label: 'Blend file upload',
    value: 'blendFile',
    fileTypes: 'blend',
    placeholder: 'Upload the blend file'
  }
];

export const PREVIEW_OPTIONS: { label: string; value: string }[] = [
  {
    label: 'Export as glb',
    value: 'glb'
  },
  {
    label: 'Export as gltf',
    value: 'gltf'
  }
];