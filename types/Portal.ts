export interface ILink {
    title: string
    url: string
    description?: string
    icon?: string
}

export interface IPortal {
    id: string
    username: string
    portalName: string
    description?: string
    slug: string
    isPrivate: boolean
    links: ILink[]
    createdAt: string
    updatedAt: string
}
