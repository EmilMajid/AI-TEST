async function testTopicsAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/textbooks/topics?class=8');
        const data = await response.json();

        if (data.success) {
            console.log('✅ API Success\n');
            console.log('Subjects with topics:');
            console.log('='.repeat(60));

            const subjects = Object.keys(data.topics);
            subjects.forEach(subject => {
                const groups = data.topics[subject];
                const totalTopics = groups.reduce((sum, g) => sum + g.topics.length, 0);
                console.log(`${subject}: ${groups.length} chapters, ${totalTopics} topics`);
            });

            console.log('\n' + '='.repeat(60));
            console.log(`Total subjects: ${subjects.length}`);

            // Check specific subjects that were problematic
            const problematicSubjects = [
                'Musiqi',
                'Təsviri incəsənət',
                'Həyat bilgisi',
                'Texnologiya',
                'İnformatika',
                'Ortaq türk tarixi',
                'Azərbaycan tarixi',
                'Alman dili',
                'Fransız dili',
                'Rus dili'
            ];

            console.log('\n📋 Previously problematic subjects:');
            console.log('='.repeat(60));
            problematicSubjects.forEach(subject => {
                if (data.topics[subject]) {
                    const groups = data.topics[subject];
                    const totalTopics = groups.reduce((sum, g) => sum + g.topics.length, 0);
                    console.log(`✓ ${subject}: ${totalTopics} topics found`);
                } else {
                    console.log(`✗ ${subject}: NOT FOUND`);
                }
            });

        } else {
            console.error('❌ API Error:', data.error);
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

testTopicsAPI();
