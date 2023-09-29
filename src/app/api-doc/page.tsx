import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

// for reference https://github.com/jellydn/next-swagger-doc

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}