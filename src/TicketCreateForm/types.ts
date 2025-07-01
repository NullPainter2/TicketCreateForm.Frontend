export type OrganizationNode = {
  id: number,
  parentId?: number,
  name: string,
}

export type Employee = {
  personalNumber: number,
  name: string,
  organizationNode?: OrganizationNode,
}