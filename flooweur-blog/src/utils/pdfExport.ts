import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Article } from '../types/Article';

export const exportArticleToPDF = async (article: Article): Promise<void> => {
  // Create a temporary div to render the article content
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '800px';
  tempDiv.style.padding = '40px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.color = 'black';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.lineHeight = '1.6';
  tempDiv.style.fontSize = '14px';

  // Create the HTML content for the PDF
  const htmlContent = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #333; margin-bottom: 10px; font-size: 28px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        ${article.title}
      </h1>
      <div style="color: #666; font-size: 12px; margin-bottom: 20px;">
        <span>Created: ${article.createdAt.toLocaleDateString()}</span>
        ${article.updatedAt.getTime() !== article.createdAt.getTime() ? 
          `<span style="margin-left: 20px;">Updated: ${article.updatedAt.toLocaleDateString()}</span>` : ''}
        ${article.folder ? `<span style="margin-left: 20px;">📁 ${article.folder}</span>` : ''}
      </div>
      ${article.tags.length > 0 ? `
        <div style="margin-bottom: 20px;">
          ${article.tags.map(tag => `
            <span style="background-color: #007bff; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; margin-right: 8px;">
              ${tag}
            </span>
          `).join('')}
        </div>
      ` : ''}
    </div>
    <div style="white-space: pre-wrap; line-height: 1.8;">
      ${convertMarkdownToHTML(article.content)}
    </div>
  `;

  tempDiv.innerHTML = htmlContent;
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};

// Simple markdown to HTML converter for PDF export
const convertMarkdownToHTML = (markdown: string): string => {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="color: #333; margin: 20px 0 10px 0; font-size: 18px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #333; margin: 25px 0 15px 0; font-size: 22px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: #333; margin: 30px 0 20px 0; font-size: 26px;">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0;"><code>$1</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/gim, '<code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #007bff; text-decoration: none;">$1</a>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li style="margin: 5px 0;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin: 5px 0;">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li style="margin: 5px 0;">$1. $2</li>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666; font-style: italic;">$1</blockquote>')
    
    // Line breaks
    .replace(/\n\n/gim, '</p><p style="margin: 10px 0;">')
    .replace(/\n/gim, '<br>')
    
    // Wrap in paragraphs
    .replace(/^(.*)$/gim, '<p style="margin: 10px 0;">$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p style="margin: 10px 0;"><\/p>/gim, '')
    .replace(/<p style="margin: 10px 0;"><br><\/p>/gim, '');
};