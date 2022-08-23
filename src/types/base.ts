export interface HasID {
  id: string | number;
}

export interface HasAuthor {
  author: string;
}

export interface HasCover {
  cover: string;
}

export interface HasTitle {
  title: string;
}

export interface IdentifiableCreation extends HasID, HasAuthor {}
