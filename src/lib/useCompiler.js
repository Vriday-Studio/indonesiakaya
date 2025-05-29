
import { useCallback, useState } from 'react';

export const COMPILER_STATE = {
  IDLE: 'IDLE',
  COMPILING: 'COMPILING',
  COMPILED: 'COMPILED',
}

const useCompiler = () => {
  const [percentage, setPercentage] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [exportedBuffer, setExportedBuffer] = useState(new Uint8Array());
  const [step, setStep] = useState(COMPILER_STATE.IDLE);

  const compiler = new window.MINDAR.IMAGE.Compiler();

  const loadImage = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const onDataReady = useCallback((dataList, exportedBuffer) => {
    setDataList(dataList);
    setExportedBuffer(exportedBuffer);
    setStep(COMPILER_STATE.COMPILED);
  }, []);

  const compileFiles = useCallback(async (files) => {
    const images = await Promise.all(files.map(loadImage));

    const dataList = await compiler.compileImageTargets(images, (progress) => {
      setPercentage(+progress.toFixed(2));
    });

    const exportedBuffer = await compiler.exportData();

    onDataReady(dataList, exportedBuffer);
  }, []);

  const loadMindFile = useCallback(async (file) => {
    const reader = new FileReader();

    reader.onload = async function () {
      if (!this.result || typeof this.result === 'string') return;

      const dataList = compiler.importData(this.result);
      const exportedBuffer = await compiler.exportData();

      onDataReady(dataList, exportedBuffer);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const startCompiler = useCallback(async (files) => {
    if (files.length === 0) {
      console.error('please select images.');
      return;
    }

    const ext = files[0].name.split('.').pop();

    if (ext === 'mind') {
      loadMindFile(files[0]);
      return;
    }

    compileFiles(files);
  }, []);

  return {
    startCompiler,
    exportedBuffer,
    percentage,
    dataList,
    step,
  };
};

export default useCompiler;
