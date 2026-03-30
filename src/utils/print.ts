import { Product, Sale, ServiceOrder } from '../types';
import belemLogo from '../assets/belem-ti-logo-black.png';

export const printInventory = (
  products: Product[],
  distributor: string,
  description: string,
  label: string,
  logo: string | null,
  iconName: string,
  color: string,
  logoBlend: string = 'normal'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const date = new Date().toLocaleDateString('pt-BR');
  const tableRows = products.map(p => `
    <tr>
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td style="text-align: center;">${p.quantity}</td>
      <td style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}</td>
      <td style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price * p.quantity)}</td>
    </tr>
  `).join('');

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);

  const getIconSvg = (name: string, color: string) => {
    const stroke = color;
    switch (name) {
      case 'Cpu': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`;
      case 'Monitor': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'HardDrive': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M12 18h.01"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M6 6h.01"/></svg>`;
      case 'Smartphone': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`;
      case 'Laptop': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0a2 2 0 0 1 2 2v1H2v-1a2 2 0 0 1 2-2"/></svg>`;
      case 'Zap': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'Award': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
      case 'Package': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
      default: return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
  };

  const headerLogoHtml = `<img src="${belemLogo}" class="company-logo-header" />`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Relatório de Inventário</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { font-family: 'Outfit', Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; line-height: 1.5; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #111827; padding-bottom: 20px; margin-bottom: 25px; }
        .company-info { display: flex; align-items: center; gap: 20px; }
        .company-logo-header { max-width: 80px; max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); mix-blend-mode: ${logoBlend}; }
        .company-info h1 { margin: 0; color: #111827; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; }
        .company-info p { margin: 4px 0; font-size: 11px; color: #6b7280; font-weight: 500; }
        .document-title { text-align: right; }
        .document-title h2 { margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; color: #111827; }
        .document-title p { margin: 5px 0 0; color: #6b7280; font-weight: 600; font-size: 10px; }
        
        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 20px; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
        th { background: #f9fafb; padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #f1f5f9; font-weight: 900; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 10px; color: #374151; font-weight: 500; }
        tr:last-child td { border-bottom: none; }
        
        .summary { display: flex; justify-content: flex-end; gap: 40px; margin-top: 30px; padding: 25px; background: #f9fafb; border-radius: 20px; border: 1px solid #f1f5f9; }
        .summary-item { text-align: right; }
        .summary-label { font-size: 9px; color: #9ca3af; text-transform: uppercase; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 5px; }
        .summary-value { font-size: 20px; font-weight: 900; color: #111827; }
        
        .footer { margin-top: 50px; text-align: center; font-size: 9px; color: #9ca3af; border-top: 1px solid #f1f5f9; padding-top: 20px; font-weight: 500; }
        
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          ${headerLogoHtml}
          <div>
            <p style="margin: 0; font-size: 10px; text-transform: uppercase; color: #111827; font-weight: 900; letter-spacing: 0.1em;">${label}</p>
            <h1>${distributor}</h1>
            <p>${description}</p>
          </div>
        </div>
        <div class="document-title">
          <h2>Relatório de Inventário</h2>
          <p>Emissão: ${date}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Produto</th>
            <th>Categoria</th>
            <th style="text-align: center;">Qtd</th>
            <th style="text-align: right;">Preço Unit.</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-item">
          <div class="summary-label">Total de Itens</div>
          <div class="summary-value">${totalItems}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Valor Total do Patrimônio</div>
          <div class="summary-value" style="color: #10b981;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</div>
        </div>
      </div>

      <div class="footer">
        Gerado por <span style="font-weight: 900; color: #111827;">BELEMTI</span> • ${new Date().toLocaleString('pt-BR')} • Página 1 de 1
      </div>

      <script>
        window.onload = () => { window.print(); window.close(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printServiceOrder = (
  os: ServiceOrder,
  distributor: string,
  description: string,
  label: string,
  logo: string | null,
  iconName: string,
  color: string,
  logoBlend: string = 'normal'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const date = new Date(os.entryDate).toLocaleDateString('pt-BR');

  const getIconSvg = (name: string, color: string) => {
    const stroke = color;
    switch (name) {
      case 'Cpu': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`;
      case 'Monitor': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'HardDrive': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M12 18h.01"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M6 6h.01"/></svg>`;
      case 'Smartphone': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`;
      case 'Laptop': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0a2 2 0 0 1 2 2v1H2v-1a2 2 0 0 1 2-2"/></svg>`;
      case 'Zap': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'Award': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
      case 'Package': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
      default: return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
  };

  const headerLogoHtml = `<img src="${belemLogo}" class="company-logo-header" />`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ordem de Serviço Nº ${os.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { font-family: 'Outfit', Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; line-height: 1.5; font-size: 12px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px; }
        .company-info { display: flex; align-items: center; gap: 20px; }
        .company-logo-header { max-width: 80px; max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); mix-blend-mode: ${logoBlend}; }
        .company-info h1 { margin: 0; color: #111827; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; }
        .company-info p { margin: 4px 0; font-size: 11px; color: #6b7280; font-weight: 500; }
        .os-badge { text-align: right; background: #3b82f6; color: #fff; padding: 15px 25px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2); }
        .os-badge h2 { margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; }
        .os-badge p { margin: 5px 0 0; font-size: 20px; font-weight: 900; }
        
        .section { margin-bottom: 25px; background: #fff; border-radius: 16px; border: 1px solid #f3f4f6; overflow: hidden; }
        .section-header { background: #f9fafb; padding: 12px 16px; font-weight: 900; text-transform: uppercase; font-size: 10px; color: #374151; border-bottom: 1px solid #f1f5f9; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
        .section-header::before { content: ""; display: block; width: 4px; height: 12px; background: #3b82f6; border-radius: 2px; }
        .section-content { padding: 16px; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-row { margin-bottom: 8px; display: flex; align-items: baseline; gap: 8px; }
        .info-label { font-weight: 700; font-size: 10px; color: #9ca3af; text-transform: uppercase; min-width: 90px; }
        .info-value { font-weight: 600; color: #1f2937; }
        .problem-box { border: 1px solid #e5e7eb; padding: 15px; min-height: 80px; font-style: italic; background: #fefce8; border-radius: 12px; color: #854d0e; font-weight: 500; }
        
        .status-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .status-table td { padding: 12px; border: 1px solid #f1f5f9; }
        .status-label { font-weight: 700; background: #f9fafb; color: #6b7280; width: 120px; font-size: 10px; text-transform: uppercase; }
        
        .terms { font-size: 9px; color: #6b7280; margin-top: 30px; border: 1px dashed #e5e7eb; padding: 15px; border-radius: 12px; background: #fafafa; }
        .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px; }
        .signature-line { border-top: 2px solid #e5e7eb; width: 280px; text-align: center; padding-top: 10px; font-size: 10px; font-weight: 700; color: #4b5563; }
        
        .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #9ca3af; font-weight: 500; }
        .highlight { color: #3b82f6; font-weight: 900; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div class="company-info">
          ${headerLogoHtml}
          <div>
            <p style="margin: 0; font-size: 10px; text-transform: uppercase; color: #3b82f6; font-weight: 900; letter-spacing: 0.1em;">${label}</p>
            <h1>${distributor}</h1>
            <p>${description}</p>
          </div>
        </div>
        <div class="os-badge">
          <h2>ORDEM DE SERVIÇO</h2>
          <p>Nº ${os.id}</p>
          <div style="font-size: 10px; margin-top: 8px; font-weight: 700; opacity: 0.9;">Entrada: ${date}</div>
        </div>
      </div>

      <div class="grid">
        <div class="section">
          <div class="section-header">Dados do Cliente</div>
          <div class="section-content">
            <div class="info-row"><span class="info-label">Nome:</span> <span class="info-value">${os.customerName}</span></div>
            <div class="info-row"><span class="info-label">Telefone:</span> <span class="info-value">${os.customerPhone || 'Não informado'}</span></div>
            <div class="info-row"><span class="info-label">CPF/CNPJ:</span> <span class="info-value">${os.customerCPF || 'Não informado'}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-header">Dados do Equipamento</div>
          <div class="section-content">
            <div class="info-row"><span class="info-label">Aparelho:</span> <span class="info-value highlight">${os.equipment}</span></div>
            <div class="info-row"><span class="info-label">Nº de Série:</span> <span class="info-value">${os.serialNumber || 'Não informado'}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Descrição do Problema / Relato do Cliente</div>
        <div class="section-content">
          <div class="problem-box">${os.problemDescription}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Detalhes Técnicos e Status</div>
        <div class="section-content" style="padding: 0;">
          <table class="status-table">
            <tr>
              <td class="status-label">Status Inicial:</td>
              <td><strong style="color: #3b82f6;">${os.status.toUpperCase()}</strong></td>
              <td class="status-label">Prioridade:</td>
              <td><strong>${os.priority}</strong></td>
            </tr>
            <tr>
              <td class="status-label">Técnico Resp.:</td>
              <td>${os.technician || 'A definir'}</td>
              <td class="status-label">Custo Est.:</td>
              <td><strong class="highlight">${os.estimatedCost ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.estimatedCost) : 'A definir'}</strong></td>
            </tr>
          </table>
        </div>
      </div>

      ${os.observations ? `
      <div class="section">
        <div class="section-header">Observações Adicionais</div>
        <div class="section-content" style="font-size: 11px; color: #4b5563; font-weight: 500;">
          ${os.observations}
        </div>
      </div>
      ` : ''}

      <div class="terms">
        <strong style="color: #111827; display: block; margin-bottom: 5px;">TERMOS E CONDIÇÕES DE SERVIÇO:</strong> 
        1. O prazo para diagnóstico e orçamento preliminar é de até 48 horas úteis após a entrada. 
        2. Equipamentos não retirados em até 90 dias após a conclusão do serviço ou reprovação do orçamento serão considerados abandonados, podendo ser vendidos para custear despesas de armazenamento. 
        3. A garantia legal é de 90 dias e cobre apenas os serviços executados e peças efetivamente substituídas. 
        4. O backup dos dados é de inteira responsabilidade do cliente. Não nos responsabilizamos por perdas de informações ou softwares.
        5. A retirada do equipamento só será permitida mediante apresentação desta Ordem de Serviço ou documento de identidade do titular.
      </div>

      <div class="signatures">
        <div class="signature-line">ASSINATURA DO CLIENTE</div>
        <div class="signature-line">CARIMBO / ASSINATURA DA EMPRESA</div>
      </div>

      <div class="footer">
        Gerado profissionalmente por <span style="font-weight: 900; color: #3b82f6;">BELEMTI</span> • ${new Date().toLocaleString('pt-BR')}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printServiceReceipt = (
  os: ServiceOrder,
  distributor: string,
  description: string,
  label: string,
  logo: string | null,
  iconName: string,
  color: string,
  warrantyTerm: string,
  logoBlend: string = 'normal'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const date = new Date().toLocaleDateString('pt-BR');

  const getIconSvg = (name: string, color: string) => {
    const stroke = color;
    switch (name) {
      case 'Cpu': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`;
      case 'Monitor': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'HardDrive': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M12 18h.01"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M6 6h.01"/></svg>`;
      case 'Smartphone': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`;
      case 'Laptop': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0a2 2 0 0 1 2 2v1H2v-1a2 2 0 0 1 2-2"/></svg>`;
      case 'Zap': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'Award': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
      case 'Package': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
      default: return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
  };

  const headerLogoHtml = `<img src="${belemLogo}" class="company-logo-header" />`;

  const itemsHtml = (os.items || []).map(item => `
    <tr>
      <td style="padding: 6px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">90 Dias</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}</td>
    </tr>
  `).join('');

  const serviceItemHtml = `
    <tr>
      <td style="padding: 6px; border: 1px solid #ddd;">${os.servicePerformed || 'Mão de Obra / Serviço Técnico'}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">90 Dias</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.estimatedCost || 0)}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.estimatedCost || 0)}</td>
    </tr>
  `;

  const totalValue = (os.items || []).reduce((acc, item) => acc + item.total, 0) + (os.estimatedCost || 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Comprovante de Serviço e Garantia Nº ${os.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { font-family: 'Outfit', Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; line-height: 1.5; font-size: 12px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 25px; }
        .company-info { display: flex; align-items: center; gap: 20px; }
        .company-logo-header { max-width: 80px; max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); mix-blend-mode: ${logoBlend}; }
        .company-info h1 { margin: 0; color: #111827; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; }
        .company-info p { margin: 4px 0; font-size: 11px; color: #6b7280; font-weight: 500; }
        .doc-badge { text-align: right; border: 2px solid #10b981; padding: 15px 25px; border-radius: 20px; background: #f0fdf4; }
        .doc-badge h2 { margin: 0; font-size: 10px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em; }
        .doc-badge p { margin: 5px 0 0; font-size: 18px; font-weight: 900; color: #111827; }
        
        .section { margin-bottom: 25px; background: #fff; border-radius: 16px; border: 1px solid #f3f4f6; overflow: hidden; }
        .section-header { background: #f9fafb; padding: 12px 16px; font-weight: 900; text-transform: uppercase; font-size: 10px; color: #374151; border-bottom: 1px solid #f1f5f9; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
        .section-header::before { content: ""; display: block; width: 4px; height: 12px; background: #10b981; border-radius: 2px; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-row { margin-bottom: 8px; display: flex; align-items: baseline; gap: 8px; }
        .info-label { font-weight: 700; font-size: 10px; color: #9ca3af; text-transform: uppercase; min-width: 90px; }
        .info-value { font-weight: 600; color: #1f2937; }
        
        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; }
        th { background: #f9fafb; padding: 14px; text-align: left; font-size: 10px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #f1f5f9; font-weight: 900; }
        td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 11px; color: #374151; font-weight: 500; }
        tr:last-child td { border-bottom: none; }
        
        .totals { text-align: right; margin-top: 20px; padding: 20px; background: #f9fafb; border-top: 1px solid #f1f5f9; }
        .total-value { font-size: 24px; font-weight: 900; color: #111827; margin-top: 5px; }
        .total-label { font-size: 10px; color: #6b7280; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .warranty { margin-top: 30px; border: 1px solid #10b981; padding: 20px; border-radius: 16px; background: #f0fdf4/30; }
        .warranty h3 { margin: 0 0 12px 0; font-size: 12px; font-weight: 900; text-transform: uppercase; color: #10b981; display: flex; align-items: center; gap: 8px; }
        .warranty p { margin: 0; font-size: 10px; line-height: 1.6; white-space: pre-line; color: #374151; font-weight: 500; }
        
        .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px; }
        .signature-line { border-top: 2px solid #e5e7eb; width: 280px; text-align: center; padding-top: 10px; font-size: 10px; font-weight: 700; color: #4b5563; }
        
        .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #9ca3af; font-weight: 500; }
        .service-perform { background: #f0f9ff; color: #0369a1; padding: 10px; border-radius: 8px; font-style: italic; margin-top: 10px; font-weight: 500; font-size: 10px; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div class="company-info">
          ${headerLogoHtml}
          <div>
            <p style="margin: 0; font-size: 10px; text-transform: uppercase; color: #10b981; font-weight: 900; letter-spacing: 0.1em;">${label}</p>
            <h1>${distributor}</h1>
            <p>${description}</p>
          </div>
        </div>
        <div class="doc-badge">
          <h2>COMPROVANTE DE ENTREGA</h2>
          <p style="font-size: 20px; margin-top: 5px;">OS Nº ${os.id}</p>
          <div style="font-size: 10px; margin-top: 8px; font-weight: 700; opacity: 0.9;">Data: ${date}</div>
        </div>
      </div>

      <div class="grid">
        <div class="section">
          <div class="section-header">Dados do Cliente</div>
          <div class="section-content">
            <div class="info-row"><span class="info-label">Nome:</span> <span class="info-value">${os.customerName}</span></div>
            <div class="info-row"><span class="info-label">Telefone:</span> <span class="info-value">${os.customerPhone || 'Não informado'}</span></div>
            <div class="info-row"><span class="info-label">CPF/CNPJ:</span> <span class="info-value">${os.customerCPF || 'Não informado'}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-header">Dados do Equipamento</div>
          <div class="section-content">
            <div class="info-row"><span class="info-label">Aparelho:</span> <span class="info-value" style="color: #10b981;">${os.equipment}</span></div>
            <div class="info-row"><span class="info-label">Nº de Série:</span> <span class="info-value">${os.serialNumber || 'Não informado'}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Serviços Realizados</div>
        <div class="section-content">
          <div class="service-perform">
            <strong>Resumo técnico:</strong><br/>
            ${os.servicePerformed || 'Reparo técnico e manutenção preventiva efetuada conforme solicitado.'}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Relação de Peças e Serviços</div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th style="text-align: center;">Qtd</th>
              <th style="text-align: center;">Garantia</th>
              <th style="text-align: right;">Unitário</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${serviceItemHtml}
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-label">Valor Total do Serviço</div>
          <div class="total-value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</div>
        </div>
      </div>

      <div class="warranty">
        <h3>Termo de Garantia</h3>
        <p>${warrantyTerm}</p>
      </div>

      <div class="signatures">
        <div class="signature-line">DATA E ASSINATURA DO CLIENTE</div>
        <div class="signature-line">ASSINATURA DO RESPONSÁVEL</div>
      </div>

      <div class="footer">
        Este documento confirma a entrega e o funcionamento do equipamento • <span style="font-weight: 900; color: #10b981;">BELEMTI</span> • ${new Date().toLocaleString('pt-BR')}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printSalesReport = (
  sales: Sale[],
  distributor: string,
  description: string,
  label: string,
  logo: string | null,
  iconName: string,
  color: string,
  logoBlend: string = 'normal'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const date = new Date().toLocaleDateString('pt-BR');
  const activeSales = sales.filter(s => s.status !== 'cancelled');

  const tableRows = sales.map(s => `
    <tr style="${s.status === 'cancelled' ? 'color: #999; text-decoration: line-through;' : ''}">
      <td>${new Date(s.timestamp).toLocaleDateString('pt-BR')}</td>
      <td>${s.id.toUpperCase()}</td>
      <td>${s.customerName || 'Consumidor'}</td>
      <td>${s.seller}</td>
      <td>${s.paymentMethod}</td>
      <td style="text-align: center;">${s.status === 'cancelled' ? 'CANCELADA' : 'FINALIZADA'}</td>
      <td style="text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.finalValue)}</td>
    </tr>
  `).join('');

  const totalRevenue = activeSales.reduce((acc, s) => acc + s.finalValue, 0);
  const totalSalesCount = activeSales.length;

  const getIconSvg = (name: string, color: string) => {
    const stroke = color;
    switch (name) {
      case 'Cpu': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`;
      case 'Monitor': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'HardDrive': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M12 18h.01"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M6 6h.01"/></svg>`;
      case 'Smartphone': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`;
      case 'Laptop': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0a2 2 0 0 1 2 2v1H2v-1a2 2 0 0 1 2-2"/></svg>`;
      case 'Zap': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'Award': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
      case 'Package': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
      default: return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
  };

  const headerLogoHtml = `<img src="${belemLogo}" class="company-logo-header" />`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Relatório de Vendas</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { font-family: 'Outfit', Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; line-height: 1.5; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 25px; }
        .company-info { display: flex; align-items: center; gap: 20px; }
        .company-logo-header { max-width: 80px; max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); mix-blend-mode: ${logoBlend}; }
        .company-info h1 { margin: 0; color: #111827; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; }
        .company-info p { margin: 4px 0; font-size: 11px; color: #6b7280; font-weight: 500; }
        .document-title { text-align: right; }
        .document-title h2 { margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; color: #111827; }
        .document-title p { margin: 5px 0 0; color: #6b7280; font-weight: 600; font-size: 10px; }
        
        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 20px; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
        th { background: #f9fafb; padding: 12px; text-align: left; font-size: 9px; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #f1f5f9; font-weight: 900; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 10px; color: #374151; font-weight: 500; }
        tr:last-child td { border-bottom: none; }
        
        .summary { display: flex; justify-content: flex-end; gap: 40px; margin-top: 30px; padding: 25px; background: #f9fafb; border-radius: 20px; border: 1px solid #f1f5f9; }
        .summary-item { text-align: right; }
        .summary-label { font-size: 9px; color: #9ca3af; text-transform: uppercase; font-weight: 900; letter-spacing: 0.05em; margin-bottom: 5px; }
        .summary-value { font-size: 20px; font-weight: 900; color: #111827; }
        
        .footer { margin-top: 50px; text-align: center; font-size: 9px; color: #9ca3af; border-top: 1px solid #f1f5f9; padding-top: 20px; font-weight: 500; }
        
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          ${headerLogoHtml}
          <div>
            <p style="margin: 0; font-size: 10px; text-transform: uppercase; color: #6366f1; font-weight: 900; letter-spacing: 0.1em;">${label}</p>
            <h1>${distributor}</h1>
            <p>${description}</p>
          </div>
        </div>
        <div class="document-title">
          <h2>Relatório de Vendas</h2>
          <p>Período: ${date}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>ID Venda</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Pagamento</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: right;">Total Líquido</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-item">
          <div class="summary-label">Volume de Vendas</div>
          <div class="summary-value">${totalSalesCount}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Faturamento Líquido</div>
          <div class="summary-value" style="color: #6366f1;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}</div>
        </div>
      </div>

      <div class="footer">
        Relatório gerado por <span style="font-weight: 900; color: #111827;">BELEMTI</span> • ${new Date().toLocaleString('pt-BR')}
      </div>

      <script>
        window.onload = () => { window.print(); window.close(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printSaleReceipt = (
  sale: Sale,
  distributor: string,
  description: string,
  label: string,
  logo: string | null,
  iconName: string,
  color: string,
  warrantyTerm: string,
  logoBlend: string = 'normal'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const date = new Date(sale.timestamp).toLocaleDateString('pt-BR');

  const getIconSvg = (name: string, color: string) => {
    const stroke = color;
    switch (name) {
      case 'Cpu': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`;
      case 'Monitor': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      case 'HardDrive': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M12 18h.01"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M6 6h.01"/></svg>`;
      case 'Smartphone': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`;
      case 'Laptop': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0a2 2 0 0 1 2 2v1H2v-1a2 2 0 0 1 2-2"/></svg>`;
      case 'Zap': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'Award': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
      case 'Package': return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
      default: return `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }
  };

  const headerLogoHtml = `<img src="${belemLogo}" class="company-logo-header" />`;

  const itemsHtml = sale.items.map(item => `
    <tr>
      <td style="padding: 6px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${item.warranty || '90 Dias'}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}</td>
      <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Comprovante de Venda Nº ${sale.id.toUpperCase()}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { font-family: 'Outfit', Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; line-height: 1.5; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #111827; padding-bottom: 20px; margin-bottom: 25px; }
        .company-info { display: flex; align-items: center; gap: 20px; }
        .company-logo-header { max-width: 80px; max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); mix-blend-mode: ${logoBlend}; }
        .company-info h1 { margin: 0; color: #111827; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; }
        .company-info p { margin: 4px 0; font-size: 11px; color: #6b7280; font-weight: 500; }
        .doc-badge { text-align: right; border: 2px solid #111827; padding: 15px 25px; border-radius: 20px; background: #f9fafb; }
        .doc-badge h2 { margin: 0; font-size: 10px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.1em; }
        .doc-badge p { margin: 5px 0 0; font-size: 18px; font-weight: 900; color: #111827; }
        
        .section { margin-bottom: 25px; background: #fff; border-radius: 16px; border: 1px solid #f3f4f6; overflow: hidden; }
        .section-header { background: #f9fafb; padding: 12px 16px; font-weight: 900; text-transform: uppercase; font-size: 10px; color: #374151; border-bottom: 1px solid #f1f5f9; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-row { margin-bottom: 8px; display: flex; align-items: baseline; gap: 8px; }
        .info-label { font-weight: 700; font-size: 10px; color: #9ca3af; text-transform: uppercase; min-width: 90px; }
        .info-value { font-weight: 600; color: #1f2937; }
        
        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; }
        th { background: #f9fafb; padding: 14px; text-align: left; font-size: 10px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #f1f5f9; font-weight: 900; }
        td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 11px; color: #374151; font-weight: 500; }
        tr:last-child td { border-bottom: none; }
        
        .totals { text-align: right; margin-top: 10px; padding: 20px; border-top: 1px solid #f1f5f9; background: #fcfcfc; }
        .total-value { font-size: 24px; font-weight: 900; color: #111827; margin-top: 5px; }
        
        .warranty { margin-top: 30px; border: 1px solid #e5e7eb; padding: 20px; border-radius: 16px; background: #fafafa; }
        .warranty h3 { margin: 0 0 12px 0; font-size: 12px; font-weight: 900; text-transform: uppercase; color: #111827; }
        .warranty p { margin: 0; font-size: 10px; line-height: 1.6; white-space: pre-line; color: #4b5563; font-weight: 500; }
        
        .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px; }
        .signature-line { border-top: 2px solid #e5e7eb; width: 280px; text-align: center; padding-top: 10px; font-size: 10px; font-weight: 700; color: #4b5563; }
        
        .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #9ca3af; font-weight: 500; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div class="company-info">
          ${headerLogoHtml}
          <div>
            <p style="margin: 0; font-size: 10px; text-transform: uppercase; color: #111827; font-weight: 900; letter-spacing: 0.1em;">${label}</p>
            <h1>${distributor}</h1>
            <p>${description}</p>
          </div>
        </div>
        <div class="doc-badge">
          <h2>COMPROVANTE DE VENDA</h2>
          <p style="font-size: 20px; margin-top: 5px;">ID: ${sale.id.toUpperCase()}</p>
          <div style="font-size: 10px; margin-top: 8px; font-weight: 700; opacity: 0.9;">Data: ${date}</div>
        </div>
      </div>

      <div class="grid">
        <div class="section">
          <div class="section-header">Dados do Cliente</div>
          <div class="section-content">
            <div class="info-row"><span class="info-label">Nome:</span> <span class="info-value">${sale.customerName || 'Consumidor Final'}</span></div>
            <div class="info-row"><span class="info-label">Telefone:</span> <span class="info-value">${sale.customerPhone || 'Não informado'}</span></div>
            <div class="info-row"><span class="info-label">CPF/CNPJ:</span> <span class="info-value">${sale.customerCPF || 'Não informado'}</span></div>
          </div>
        </div>
        <div class="section">
          <div class="section-header">Informações da Venda</div>
          <div class="section-content">
            <div class="info-row"><span class="info-label">Vendedor:</span> <span class="info-value">${sale.seller}</span></div>
            <div class="info-row"><span class="info-label">Pagamento:</span> <span class="info-value" style="color: #6366f1;">${sale.paymentMethod}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Produtos e Itens Comprados</div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th style="text-align: center;">Qtd</th>
              <th style="text-align: center;">Garantia</th>
              <th style="text-align: right;">Unitário</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="totals">
          <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: 900; margin-bottom: 5px;">
            Subtotal: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalValue)}
          </div>
          <div style="font-size: 10px; color: #ef4444; text-transform: uppercase; font-weight: 900; margin-bottom: 5px;">
            Desconto: -${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.discount)}
          </div>
          <div style="font-size: 11px; color: #111827; text-transform: uppercase; font-weight: 900;">Total da Venda</div>
          <div class="total-value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.finalValue)}</div>
        </div>
      </div>

      <div class="warranty">
        <h3>Termo de Garantia e Condições</h3>
        <p>${warrantyTerm}</p>
      </div>

      <div class="signatures">
        <div class="signature-line">DATA E ASSINATURA DO CLIENTE</div>
        <div class="signature-line">RESPONSÁVEL PELA VENDA</div>
      </div>

      <div class="footer">
        Obrigado pela preferência! • <span style="font-weight: 900; color: #111827;">${distributor}</span> • ${new Date().toLocaleString('pt-BR')}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
