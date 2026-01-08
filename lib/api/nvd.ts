import { NewsArticle } from "@/types/news";
import { categorizeArticle } from "@/lib/utils";

interface NVDVulnerability {
  cve: {
    id: string;
    descriptions: Array<{
      lang: string;
      value: string;
    }>;
    published: string;
    lastModified: string;
    metrics?: {
      cvssMetricV31?: Array<{
        cvssData: {
          baseScore: number;
        };
      }>;
    };
    references?: Array<{
      url: string;
    }>;
  };
}

export async function fetchNVDVulnerabilities(): Promise<NewsArticle[]> {
  try {
    // Fetch recent CVEs from NVD (last 7 days, modified recently)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?lastModStartDate=${startDate}T00:00:00.000&lastModEndDate=${endDate}T23:59:59.999&resultsPerPage=20`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour (NVD has rate limits)
      }
    );

    if (!response.ok) {
      console.error('NVD API error:', response.statusText);
      return [];
    }

    const data = await response.json();
    const vulnerabilities: NVDVulnerability[] = data.vulnerabilities || [];

    return vulnerabilities.slice(0, 15).map((vuln) => {
      const cve = vuln.cve;
      const description = cve.descriptions.find(d => d.lang === 'en')?.value || 'No description';
      const score = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
      const url = cve.references?.[0]?.url || `https://nvd.nist.gov/vuln/detail/${cve.id}`;

      return {
        id: `nvd-${cve.id}`,
        title: `${cve.id} - CVE Vulnerability${score ? ` (Score: ${score})` : ''}`,
        description: description.slice(0, 200),
        url: url,
        source: 'nvd' as const,
        category: 'Security',
        publishedAt: cve.published,
        author: 'NVD/NIST',
        imageUrl: undefined,
        tags: ['cve', 'vulnerability', 'security'],
      };
    });
  } catch (error) {
    console.error('Error fetching NVD vulnerabilities:', error);
    return [];
  }
}
