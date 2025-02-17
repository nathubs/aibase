export const fooAvatar: React.CSSProperties = {
    color: '#f56a00',
    backgroundColor: '#fde3cf',
};

export const barAvatar: React.CSSProperties = {
    color: '#fff',
    backgroundColor: '#87d068',
};


export interface PaaSChatMessage {
    id: string;
    content: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'link' | 'file';
    sender: 'user' | 'bot';
    feedback?: {
        rating: 'like' | 'dislike';
    };
}
