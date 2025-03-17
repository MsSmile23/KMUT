export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1 }}>{children}</span>
}