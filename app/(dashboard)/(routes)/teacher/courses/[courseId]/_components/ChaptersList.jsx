'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Grip, PencilIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { set } from 'zod';

const ChaptersList = ({ items, onEdit, onReorder }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  //   This is for hydration issues due to dnd package
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updateChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);

    const bulkUpdateData = updateChapters.map((chapter, index) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chapters'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'flex items-center ',
                      'bg-slate-200 border border-slate-200 text-slate-700 rounded-md mb-4 text-sm',
                      'hover:bg-slate-200',
                      chapter.isPublished && 'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        chapter.isPublished && 'border-sky-200 hover:bg-sky-200'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className='h-5 w-5' />
                    </div>
                    {chapter.title}
                    <div className='flex pr-2 ml-auto'>
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge className={cn('bg-slate-500', chapter.isPublished && 'bg-sky-700')}>{chapter.isPublished ? 'Published' : 'Draft'}</Badge>
                      <PencilIcon className='ml-2 h-4 w-4 hover:opacity-75 cursor-pointer transition' onClick={() => onEdit(chapter.id)} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;
