import PDFDocument from 'pdfkit';
import { CandidateProfile, User, WorkExperience, Education } from '@prisma/client';

type FullProfile = CandidateProfile & {
  user: User;
  workExperiences: WorkExperience[];
  educations: Education[];
};

export const generateResumePdfService = (profile: FullProfile): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Colors & Fonts
      const primaryColor = '#2563EB'; // blue-600
      const textColor = '#1E293B'; // slate-800
      const lightText = '#64748B'; // slate-500

      // --- Header ---
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .fillColor(primaryColor)
        .text(`${profile.user.firstName || ''} ${profile.user.lastName || ''}`.trim() || 'Candidate Resume');

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(lightText)
        .moveDown(0.5);

      const contactInfo = [
        profile.user.email,
        profile.mobileNumber,
        profile.city,
      ].filter(Boolean).join('  |  ');
      
      doc.text(contactInfo);
      doc.moveDown(1.5);

      // --- About Me ---
      if (profile.aboutMe) {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('PROFESSIONAL SUMMARY');
        doc.moveDown(0.25);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E2E8F0').stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(profile.aboutMe, { align: 'justify', lineGap: 3 });
        doc.moveDown(1.5);
      }

      // --- Work Experience ---
      if (profile.workExperiences && profile.workExperiences.length > 0) {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('EXPERIENCE');
        doc.moveDown(0.25);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E2E8F0').stroke();
        doc.moveDown(0.5);

        profile.workExperiences.forEach((we: any) => {
          doc.font('Helvetica-Bold').fontSize(11).fillColor(textColor).text(we.title, { continued: true });
          doc.font('Helvetica').fontSize(11).text(' | ', { continued: true });
          doc.font('Helvetica-Oblique').fontSize(10).fillColor(primaryColor).text(we.company);
          
          const start = we.startDate ? new Date(we.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
          const end = we.isCurrent ? 'Present' : (we.endDate ? new Date(we.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
          doc.font('Helvetica').fontSize(9).fillColor(lightText).text(`${start} — ${end}`);
          
          doc.moveDown(0.25);
          
          if (we.description) {
            doc.font('Helvetica').fontSize(9.5).fillColor(textColor).text(we.description, { align: 'justify', lineGap: 2 });
          }
          
          doc.moveDown(1);
        });
      }

      // --- Education ---
      if (profile.educations && profile.educations.length > 0) {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('EDUCATION');
        doc.moveDown(0.25);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E2E8F0').stroke();
        doc.moveDown(0.5);

        profile.educations.forEach(ed => {
          doc.font('Helvetica-Bold').fontSize(11).fillColor(textColor).text(`${ed.degree} ${ed.fieldOfStudy ? `in ${ed.fieldOfStudy}` : ''}`);
          doc.font('Helvetica-Oblique').fontSize(10).fillColor(primaryColor).text(ed.institution);
          
          const start = ed.startDate ? new Date(ed.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
          const end = ed.isCurrent ? 'Present' : (ed.endDate ? new Date(ed.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
          doc.font('Helvetica').fontSize(9).fillColor(lightText).text(`${start} — ${end}`);
          
          doc.moveDown(1);
        });
      }

      // --- Skills ---
      if (profile.skills && profile.skills.length > 0) {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('SKILLS');
        doc.moveDown(0.25);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E2E8F0').stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(profile.skills.join(' • '));
        doc.moveDown(1.5);
      }

      // --- Languages ---
      if (profile.languages && profile.languages.length > 0) {
        doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryColor).text('LANGUAGES');
        doc.moveDown(0.25);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E2E8F0').stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(profile.languages.join(' • '));
        doc.moveDown(1.5);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
