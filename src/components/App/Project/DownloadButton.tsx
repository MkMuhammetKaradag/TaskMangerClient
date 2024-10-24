import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function DownloadButton() {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    const nodes = getNodes();
    const nodesBounds = getNodesBounds(nodes);

    // Diyagramın gerçek boyutlarını hesapla
    const padding = 50; // Kenarlar için extra boşluk
    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;

    // En-boy oranını koru
    const aspectRatio = width / height;
    let finalWidth = width;
    let finalHeight = height;

    // Maksimum boyut sınırları
    const maxWidth = 3000;
    const maxHeight = 3000;

    // Boyutları maksimum sınırlar içinde tut
    if (width > maxWidth) {
      finalWidth = maxWidth;
      finalHeight = maxWidth / aspectRatio;
    }
    if (height > maxHeight) {
      finalHeight = maxHeight;
      finalWidth = maxHeight * aspectRatio;
    }

    const viewport = getViewportForBounds(
      nodesBounds,
      finalWidth,
      finalHeight,
      0.5,
      2,
      1
    );

    const selectReactFlow = document.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement;

    if (selectReactFlow) {
      toPng(selectReactFlow, {
        backgroundColor: '#1a365d',
        width: finalWidth,
        height: finalHeight,
        style: {
          width: finalWidth.toString(),
          height: finalHeight.toString(),
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
        pixelRatio: 2, // Daha yüksek kalite için
      }).then(downloadImage);
    }
  };

  return (
    <Panel position="top-right">
      <button className="download-btn" onClick={onClick}>
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadButton;
