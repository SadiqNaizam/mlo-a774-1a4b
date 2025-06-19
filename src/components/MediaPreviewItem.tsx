import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Image as ImageIconLucide, // Renamed to avoid conflict with potential future HTMLImageElement type
  Video as VideoIconLucide, // Renamed
  FileAudio,
  FileText,
  FileArchive,
  FileCode2,
  File as FileIcon,
  Download,
  PlayCircle,
} from 'lucide-react';

interface MediaPreviewItemProps {
  file: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other';
    name?: string;
    size?: string; // e.g., "1.2 MB"
    thumbnailUrl?: string; // For video or large image preview
  };
}

const MediaPreviewItem: React.FC<MediaPreviewItemProps> = ({ file }) => {
  console.log('MediaPreviewItem loaded for:', file.name || file.url);

  const getFileIcon = (type: MediaPreviewItemProps['file']['type']) => {
    switch (type) {
      case 'audio':
        return FileAudio;
      case 'document':
        return FileText;
      case 'archive':
        return FileArchive;
      case 'code':
        return FileCode2;
      case 'video': // Fallback icon if no thumbnail
        return VideoIconLucide;
      case 'image': // Fallback icon if no thumbnail
        return ImageIconLucide;
      default:
        return FileIcon;
    }
  };

  if (file.type === 'image') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="focus:outline-none rounded-lg overflow-hidden group relative max-w-[250px] w-auto h-auto max-h-[200px] block cursor-pointer border border-slate-200 dark:border-slate-700">
            <img
              src={file.thumbnailUrl || file.url}
              alt={file.name || 'Image preview'}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/250x200?text=Image+Not+Found')}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ImageIconLucide className="w-8 h-8 text-white" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-2 bg-background/90 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <DialogHeader className="sr-only">
            <DialogTitle>{file.name || 'Image Viewer'}</DialogTitle>
          </DialogHeader>
          <img
            src={file.url}
            alt={file.name || 'Image full view'}
            className="w-full h-auto object-contain rounded-md"
            style={{ maxHeight: '85vh' }}
            onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if full image fails
          />
          {/* Fallback if image fails to load in dialog */}
          <div className="hidden" onErrorCapture={(e) => e.currentTarget.classList.remove('hidden')}>
             <p className="text-center text-muted-foreground p-8">Could not load image.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (file.type === 'video') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="focus:outline-none rounded-lg overflow-hidden group relative max-w-[250px] w-auto h-auto max-h-[200px] block cursor-pointer border border-slate-200 dark:border-slate-700 aspect-video bg-slate-900">
            {file.thumbnailUrl ? (
              <img
                src={file.thumbnailUrl}
                alt={file.name || 'Video preview'}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.video-fallback-icon-container');
                    if (fallback) fallback.classList.remove('hidden');
                    e.currentTarget.classList.add('hidden');
                  }
                }}
              />
            ) : null}
            <div className={`video-fallback-icon-container w-full h-full flex items-center justify-center ${file.thumbnailUrl ? 'hidden' : ''}`}>
              <VideoIconLucide className="w-12 h-12 text-white/70" />
            </div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-2 bg-background/90 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <DialogHeader className="sr-only">
             <DialogTitle>{file.name || 'Video Player'}</DialogTitle>
          </DialogHeader>
          <video
            src={file.url}
            controls
            autoPlay
            className="w-full h-auto object-contain rounded-md"
            style={{ maxHeight: '85vh' }}
          >
            Your browser does not support the video tag. {file.name && `Attempting to play: ${file.name}`}
          </video>
        </DialogContent>
      </Dialog>
    );
  }

  // For other file types (audio, document, archive, code, other)
  const IconComponent = getFileIcon(file.type);
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download={file.name} // Download attribute with filename suggestion
      className="flex items-center p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors w-full max-w-[280px] group border border-slate-300 dark:border-slate-700"
      title={`Download or open ${file.name || 'file'}${file.size ? ` (${file.size})` : ''}`}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center mr-3">
        <IconComponent className="w-6 h-6 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="truncate flex-grow min-w-0"> {/* Added min-w-0 for proper truncation in flex */}
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{file.name || 'Attached File'}</p>
        {file.size && <p className="text-xs text-slate-500 dark:text-slate-400">{file.size}</p>}
      </div>
      <Download className="w-5 h-5 ml-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 flex-shrink-0" />
    </a>
  );
};

export default MediaPreviewItem;